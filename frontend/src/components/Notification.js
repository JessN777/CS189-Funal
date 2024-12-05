import React, { useState, useEffect } from 'react';

const Notification = ({ message, type, onClose }) => {
    const [show, setShow] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShow(false);
            onClose(); // Notify the parent to remove the notification
        }, 3000); // Adjust the timeout duration (3000ms = 3 seconds)
        return () => clearTimeout(timer); // Cleanup the timer
    }, [onClose]);

    if (!show) return null;

    return (
        <div
            className={`notification alert ${
                type === 'success' ? 'alert-success' : 'alert-danger'
            }`}
            role="alert"
            style={{
                position: 'fixed',
                top: '20px',
                right: '20px',
                zIndex: 1050,
                boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                maxWidth: '300px',
            }}
        >
            {message}
        </div>
    );
};

export default Notification;
