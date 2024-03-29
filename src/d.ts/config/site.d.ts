export declare type HeaderConfigType = Array<HeaderBarInterface>;

interface HeaderBarInterface {
    path?: string;
    icon: string;
    word: string;
    children?: Array<{
        path: string;
        icon: string;
        word: string;
    }>
}

export declare type SideMenuConfigType = Array<SideMenuInterface>;

interface SideMenuInterface {
    path: string;
    icon: string;
    word: string;
}
