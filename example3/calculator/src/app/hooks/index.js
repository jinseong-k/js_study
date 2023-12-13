import {useContext} from "react";
import {StoreContext} from "../context";

export const useStoreContext = () => useContext(StoreContext);