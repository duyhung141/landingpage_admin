import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Toast from "../LoadingError/Toast";
import Message from "../LoadingError/Error";
import Loading from "../LoadingError/LoadingError";
import { useMutationHooks } from "../../hooks/useMutationHooks";
import * as VoucherService from "../../Services/VoucherService";

const AddMessageMain = () => {
  const [code, setCode] = useState("");
  const [discount, setDiscount] = useState("");
  const [expiryDays, setExpiryDays] = useState("");
  const toastId = React.useRef(null);
  const Toastobjects = {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  };

  const mutationAddCategory = useMutationHooks((data) => {
    const { access_token, ...rests } = data;
    const res = VoucherService.createVoucher(rests, access_token);
    return res;
  });

  const submitHandler = async (event) => {
    event.preventDefault();
    if (code === "" && discount === "" && expiryDays === "") {
      if (!toast.isActive(toastId.current)) {
        toastId.current = toast.error("Không được để trống!", Toastobjects);
      }
    } else {
      const access_token = JSON.parse(localStorage.getItem("access_token"));
      mutationAddCategory.mutate({
        code,
        discount,
        expiryDays,
        access_token,
      });
    }
  };

  const { error, isLoading, isSuccess, isError } = mutationAddCategory;
  useEffect(() => {
    if (!error && isSuccess) {
      if (!toast.isActive(toastId.current)) {
        toastId.current = toast.success("Thành công!", Toastobjects);
      }
    } else if (error) {
      if (!toast.isActive(toastId.current)) {
        toastId.current = toast.error(
          error.response.data.message,
          Toastobjects
        );
      }
    }
  }, [error, isSuccess]);
  return (
    <>
      <Toast />
      <section className="content-main" style={{ maxWidth: "1200px" }}>
        <form onSubmit={submitHandler}>
          <div className="content-header">
            <Link to="/review" className="btn btn-danger text-white">
             Quay lại
            </Link>
            <h2 className="content-title">Thêm mã giảm giá</h2>
            <div>
              <button type="submit" className="btn btn-primary">
                Xác nhận thêm
              </button>
            </div>
          </div>

          <div className="row mb-4">
            <div className="col-xl-12 col-lg-12">
              <div className="card mb-4 shadow-sm">
                <div className="card-body">
                  {/* {error && <Message variant="alert-danger">{error}</Message>}
                  {loading && <Loading />} */}
                  <div className="mb-4">
                    <label htmlFor="code" className="form-label">
                      Mã giảm giá
                    </label>
                    <input
                      type="text"
                      placeholder="Type here"
                      className="form-control"
                      id="code"
                      required
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="discount" className="form-label">
                      Khuyến mãi
                    </label>
                    <input
                      type="text"
                      placeholder="Type here"
                      className="form-control"
                      id="product_title"
                      required
                      value={discount}
                      onChange={(e) => setDiscount(e.target.value)}
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="expiryDays" className="form-label">
                      Thời gian giảm giá
                    </label>
                    <input
                      type="text"
                      placeholder="Type here"
                      className="form-control"
                      id="expiryDays"
                      required
                      value={expiryDays}
                      onChange={(e) => setExpiryDays(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </section>
    </>
  );
};
export default AddMessageMain;
