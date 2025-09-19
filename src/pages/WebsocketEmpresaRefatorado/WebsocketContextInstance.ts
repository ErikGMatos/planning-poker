import { createContext } from "react";
import { type WebsocketContextType } from "./WebsocketContextTypes";

export const WebsocketContext = createContext<WebsocketContextType | null>(null);
