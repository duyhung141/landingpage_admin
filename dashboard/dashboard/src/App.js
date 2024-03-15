import "./App.css";
import "react-toastify/dist/ReactToastify.css";
import {BrowserRouter, Routes, Route, useLocation} from "react-router-dom";
import LoginScreen from "./Screen/LoginScreen";
import HomeScreen from "./Screen/HomeScreen";
import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";
import {fetchAsyncProducts} from "./features/productSlide/productSlice";
import * as PayService from "./Services/OrderSevice";
import {updatePay} from "./features/Order/Order";
import ProductScreen from "./Screen/ProductScreen";
import AddProduct from "./Screen/AddProductScreen";
import EditProductMain from "./Components/Product/EditProduct";
import EditProductScreen from "./Screen/EditProductSreen";
import OrderScreen from "./Screen/OrdersScreen";
import EditOrdersScreen from "./Screen/EditOrderScreen";
import UserMain from "./Components/User/Usermain";
import UserScreen from "./Screen/UserScreen";
import EditUserScreen from "./Screen/EditUserScreen";
import CategoryScreen from "./Screen/CategoryScreen";
import AddCategory from "./Screen/AddCategorySreen";

import PaymentScreen from "./Screen/PaymentScreen";

import VoucherScreen from "./Screen/VoucherScreen";
import EditVoucherScreen from "./Screen/EditVoucherScreen";
import AddVoucherScreen from "./Screen/AddVoucherScreen";

import MessageScreen from "./Screen/MessageScreen";
import EditMessageScreen from "./Screen/EditMessageScreen";

import PrivateRoutes from "./PrivateRouter";
import * as UserService from "./Services/UserService";
import {updateUser} from "./features/userSlide/userSlide";
import jwt_decode from "jwt-decode";
import {isJsonString} from "./utils";
import EditPaymentMain from "./Components/Payment/EditPayment";
import EditPaymentScreen from "./Screen/EditPaymentScreen";

function App() {
    const userLogin = useSelector((state) => state.user);
    // const location = useLocation();

    const dispatch = useDispatch();
    const {email} = userLogin;
    const pageNumber = 1;

    useEffect(() => {
        if (email !== "") {
            dispatch(fetchAsyncProducts());
            // hangldeGetAll()
        }
    }, [dispatch]);
    useEffect(() => {
        const {storageData, decoded} = handleDecoded();
        if (decoded?.id) {
            handleGetDetailsUser(decoded?.id, storageData);
        }
        //  dispatch(updateUser({data}))
    }, []);
    const handleDecoded = () => {
        let storageData = localStorage.getItem("access_token");
        let token_refresh = localStorage.getItem("refresh_token");
        let decoded = {};
        if (storageData && isJsonString(storageData)) {
            storageData = JSON.parse(storageData);
            token_refresh = JSON.parse(token_refresh);
            decoded = jwt_decode(storageData);
        }
        return {decoded, storageData, token_refresh};
    };
    UserService.axiosJWT.interceptors.request.use(
        async (config) => {
            // Do something before request is sent
            const currentTime = new Date();
            const {decoded, token_refresh} = handleDecoded();
            // console.log(decoded?.exp < currentTime.getTime() / 1000)
            if (decoded?.exp < currentTime.getTime() / 1000) {
                const data = await UserService.refreshToken(token_refresh);
                console.log(data)

                config.headers["Authorization"] = `Bearer ${data?.access_token}`;
            }
            return config;
        },
        (err) => {
            return Promise.reject(err);
        }
    );
    const handleGetDetailsUser = async (id, token) => {
        const res = await UserService.getDetailsUser(id, token);
        dispatch(updateUser({...res?.data, access_token: token}));
    };

    return (
        <BrowserRouter>
            <Routes>
                {/*<Route element={<PrivateRoutes/>}>*/}
                    <Route>
                        <Route path="/" element={<HomeScreen/>}/>
                        <Route path="/products" element={<ProductScreen/>}/>
                        <Route path="/addproduct" element={<AddProduct/>}/>
                        <Route path="/orders" element={<OrderScreen/>}/>
                        <Route path="/users" element={<UserScreen/>}/>
                        <Route path="/category" element={<CategoryScreen/>}/>
                        <Route path="/addcategory" element={<AddCategory/>}/>

                        {/*<Route path="/users/:id/edit" element={<EditUserScreen />} />*/}

                        <Route path="/product/:id/edit" element={<EditProductScreen/>}/>
                        <Route path="/orders/:id/edit" element={<EditOrdersScreen/>}/>

                        <Route path="/payment" element={<PaymentScreen/>}/>
                        <Route path="/payment/:id/edit" element={<EditPaymentScreen/>}/>

                        <Route path="/voucher" element={<VoucherScreen/>}/>
                        <Route path="/voucher/:id/edit" element={<EditVoucherScreen/>}/>
                        <Route path="/voucher/create" element={<AddVoucherScreen/>}/>

                        <Route path="/message" element={<MessageScreen/>}/>
                        <Route path="/message/create" element={<AddVoucherScreen/>}/>
                        <Route path="/message/:id/edit" element={<EditMessageScreen/>}/>

                    {/*</Route>*/}
                </Route>
                <Route path="/login" element={<LoginScreen/>}/>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
