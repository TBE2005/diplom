import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/carousel/styles.css';

import { DirectionProvider, MantineProvider } from "@mantine/core";
import { Notifications } from '@mantine/notifications';
import { ModalsProvider } from '@mantine/modals';

export const MantineProviders = ({ children }: { children: React.ReactNode }) => {
    return (
        <DirectionProvider>
            <MantineProvider>
                <ModalsProvider>
                    <Notifications />
                    {children}
                </ModalsProvider>
            </MantineProvider>
        </DirectionProvider>
    )
}