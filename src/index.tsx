import ReactDOM from "react-dom/client";
import GlobalStyle from "./shared/GlobalStyle";
import { Router } from "./shared/Router";
import { Provider } from "react-redux";
import store from "./redux/config/configStore";
import { CookiesProvider } from "react-cookie";

const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement
);

root.render(
    <CookiesProvider>
        <GlobalStyle />
        <Provider store={store}>
            <Router />
        </Provider>
    </CookiesProvider>
);
