import React, { useEffect, useState } from "react";
import MessageError from "../LoadingError/Error";
import Loading from "../LoadingError/LoadingError";
import Message from "./Message";
import { useSelector } from "react-redux";
import * as MessageService from "../../Services/MessageService";
import { error } from "jquery";
import {Link} from "react-router-dom";
const MessageMain = () => {
      // const paymentList = useSelector((state) => state.paymentList);
      // const { loading, error, payments } = paymentList;
    const [loading, setLoading] = useState("");
    const [error, setError] = useState("");
    const [tempData, setTempData] = useState([]);
    const [search, SetSearch] = useState("");

    const hangldeGetAll = async () => {
        setLoading(true);
        const access_token = localStorage.getItem("access_token")
        console.log(typeof access_token)
        await MessageService.getPay(JSON.parse(access_token))
            .then((res) => {
                setLoading(false);
                setTempData(res);
            })
            .catch((error) => {
                setError(error);
            });

    };
    useEffect(() => {
        if (search === "") {
            hangldeGetAll();
        } else {
            const result = tempData.filter((message) => {
                const values = Object.values(message).join().toLowerCase();
                return values.includes(search.toLowerCase());
            });
            setTempData(result);
        }
    }, [search]);
    return (
        <>
            <section className="content-main">
                <div className="content-header">
                    <h2 className="content-title">Bình luận</h2>
                    <div>
                        <Link to="/message/create" className="btn btn-primary">
                            Thêm mới
                        </Link>
                    </div>
                </div>

                <div className="card mb-4 shadow-sm">
                    <div className="card-body">
                        <div className="table-responsive">
                            {loading ? (
                                <Loading />
                            ) : error ? (
                                <MessageError variant="alert-danger">{error}</MessageError>
                            ) : (
                                <Message data={tempData} search={search} />
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default MessageMain;
