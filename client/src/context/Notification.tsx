import { Timelimited } from "@components/Timelimited/Timelimited";
import type { Color } from "@core/types";
import { Alert } from "@heroui/react";
import type { PropsWithChildren } from "react";
import { createContext, useContext, useState } from "react";

type Notification = {
    message?: string,
    type?: Color
    description?: string
}

type NotificationValue = {
    notify: (notification: Notification) => void;
}

const NotificationContext = createContext<NotificationValue>({ notify: () => {} });

/** The amount of time for notifications to stay visible notification center */
const NOTIFICATION_DELAY = 3000;

function NotificationProvider(props: PropsWithChildren) {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    function notify(notification: Notification) {
        setNotifications((oldNotifications) => [
            ...oldNotifications,
            notification
        ]);
    }

    console.log(notifications);

    return <NotificationContext.Provider value={{ notify }}>
        {props.children}

        {notifications.length > 0 && <div key={"primary"} className="w-[450px] flex items-center fixed z-[99999] bottom-[15px] right-[15px]">
            <div className="w-full flex flex-col gap-2">
                {notifications.map((item, index) => {
                    return (<Timelimited key={index} delay={NOTIFICATION_DELAY}>
                        <Alert color={item.type ?? "default"} description={item.description} title={item.message} variant="faded" />
                    </Timelimited>
                )
                })}
            </div>
        </div>}
    </NotificationContext.Provider>
}

export default NotificationProvider;

export const useNotification = () => {
    return useContext(NotificationContext);
};
