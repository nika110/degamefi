import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const Notifications = ({ Cryptos }) => {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const checkCryptos = () => {
            const newNotifications = Object.values(Cryptos).flatMap(category =>
                category.map(crypto => {
                    const performanceValue = parseFloat(crypto.performance);
                    if (Math.abs(performanceValue) > 10) {
                        const isPositive = performanceValue > 0;
                        return {
                            id: Date.now(),
                            message: `${crypto.company} (${crypto.symbol}) is ${isPositive ? 'up' : 'down'} `,
                            performance: crypto.performance,
                            isPositive: isPositive
                        };
                    }
                    return null;
                })
            ).filter(Boolean);

            if (newNotifications.length > 0) {
                setNotifications([newNotifications[0]]); // Only keep the newest notification
            }
        };

        checkCryptos();
        const interval = setInterval(checkCryptos, 5000); // Check every 30 seconds

        return () => clearInterval(interval);
    }, [Cryptos]);

    const closeNotification = (id) => {
        setNotifications(prevNotifications => prevNotifications.filter(notif => notif.id !== id));
    };

    return (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 max-w-md w-full z-50">
            {notifications.map((notification) => (
                <div
                    key={notification.id}
                    className="bg-degamefi-gray-900 bg-opacity-80 text-degamefi-white p-4 mb-2 rounded-degamefi shadow-degamefi relative"
                >
                    {notification.message}
                    <span className={notification.isPositive ? 'text-green-500' : 'text-red-500'}>
            {notification.performance}
          </span>
                    <span className="text-degamefi-white"> this month!</span>
                    <button
                        onClick={() => closeNotification(notification.id)}
                        className="absolute top-1 right-1 text-degamefi-white hover:text-degamefi-gray-light"
                    >
                        <X size={16} />
                    </button>
                </div>
            ))}
        </div>
    );
};

export default Notifications;