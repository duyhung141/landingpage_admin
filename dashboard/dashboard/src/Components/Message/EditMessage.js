import React, { useState, useEffect } from "react";
import Toast from "./../LoadingError/Toast";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Message from "../LoadingError/Error";
import Loading from "../LoadingError/LoadingError";
import { useMutationHooks } from "../../hooks/useMutationHooks";
import { useQuery } from "react-query";
import * as MessageService from "../../Services/MessageService";
import { toast } from "react-toastify";
import * as ProductService from "../../Services/ProductService";
import axios from "axios";

const EditMessage = (props) => {
  const { id } = props;
  const [discount, setDiscount] = useState("");
  const [expiryDays, setExpiryDays] = useState("");
  const [user, setUser] = useState("");
  const [product, setProduct] = useState("");
  const [rating, setRating] = useState("");
  const [comment, setContentReview] = useState("");
  const [thumnail, setThumbNail] = useState([]);
  const [listProduct, setListProduct] = useState([]);
  const dispatch = useDispatch();

  const [images, setImages] = useState([]);

  const handleFileInputChange = (event) => {
    const selectedImages = Array.from(event.target.files);
    setImages(selectedImages);
  };

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
  const handleGetDetailsVoucher = async () => {
    const res = await MessageService.getDetilsPay(id);
    setUser(res.user);
    setProduct(res.product);
    setRating(res.rating);
    setContentReview(res.comment);
    setThumbNail(res.thumbnail);
    return res;
  };
  const mutation = useMutationHooks((data) => {
    const { id, access_token, ...rests } = data;
    MessageService.updatePay(id, rests, access_token);
  });
  const { data, error, isLoading, isError, isSuccess } = mutation;
  const handleUpdate = async (e) => {
    e.preventDefault();
    let uploadedImageUrls;

    try {
      for (const image of images) {
        const formData = new FormData();
        formData.append("file", image);
        formData.append("upload_preset", "Project1");

        const response = await axios.post(
          `https://api.cloudinary.com/v1_1/dgeeyhyzq/image/upload`,
          formData
        );
        uploadedImageUrls = response.data.secure_url;
      }
    } catch (error) {
      console.log(error);
    }
    await mutation.mutate({
      id,
      user,
      product,
      rating,
      comment,
      thumnail: uploadedImageUrls ? uploadedImageUrls : thumnail,
    });
  };

  //   const { isLoading: getDetail, data: dataDetail } = useQuery(
  //     ["products"],
  //     handleGetDetailsVoucher
  //   );
  const hangldeGetAllProdut = async () => {
    const resProduct = await ProductService.getAll();
    if (resProduct) {
      setListProduct(resProduct);
    }
  };

  useEffect(() => {
    hangldeGetAllProdut();
    handleGetDetailsVoucher();
  }, []);

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
  }, [id, error, isSuccess]);
  return (
    <>
      <Toast />
      <section className="content-main" style={{ maxWidth: "1200px" }}>
        <form onSubmit={handleUpdate}>
          <div className="content-header">
            <Link to="/review" className="btn btn-danger text-white">
              Quay lại
            </Link>
            <h2 className="content-title">Sửa bình luận</h2>
            <div>
              <button type="submit" className="btn btn-primary">
                Edit now
              </button>
            </div>
          </div>

          <div className="row mb-4">
            <div className="col-xl-12 col-lg-12">
              <div className="card mb-4 shadow-sm">
                <div className="card-body">
                  {/* Error Loading */}
                  {false && <Message variant="alert-danger">error</Message>}
                  {/* Update Loading */}

                  {/* {productSingleStatus && <Loading />} */}

                  {/* productSingleStatus Loading */}

                  <>
                    <div className="mb-4">
                      <label htmlFor="code" className="form-label">
                        Người dùng
                      </label>
                      <input
                        type="text"
                        placeholder="Type here"
                        className="form-control"
                        required
                        value={user}
                        onChange={(e) => setUser(e.target.value)}
                      />
                    </div>
                    <div className="mb-4">
                      <label htmlFor="discount" className="form-label">
                        Sản phẩm
                      </label>
                      <select
                        id="product"
                        className="form-select"
                        value={product}
                        onChange={(e) => setProduct(e.target.value)}
                      >
                        {listProduct.map((item) => (
                          <option value={item._id}>{item.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-4">
                      <label htmlFor="expiryDays" className="form-label">
                        Rating
                      </label>
                      <input
                        type="text"
                        placeholder="Type here"
                        className="form-control"
                        id="expiryDays"
                        required
                        value={rating}
                        onChange={(e) => setRating(e.target.value)}
                      />
                    </div>
                    <div className="mb-4">
                      <label htmlFor="expiryDays" className="form-label">
                        Nội dung review
                      </label>
                      <input
                        type="text"
                        placeholder="Type here"
                        className="form-control"
                        id="expiryDays"
                        required
                        value={comment}
                        onChange={(e) => setContentReview(e.target.value)}
                      />
                    </div>
                    <div class="mb-3">
                      <label for="formFileMultiple" class="form-label">
                        Ảnh
                      </label>
                      <input
                        class="form-control"
                        type="file"
                        id="formFileMultiple"
                        onChange={handleFileInputChange}
                      />
                      <div className="d-flex mt-3 ">
                        <img
                          src={thumnail}
                          width="10%"
                          style={{ marginLeft: "12px" }}
                        />
                      </div>
                    </div>
                  </>
                </div>
              </div>
            </div>
          </div>
        </form>
      </section>
    </>
  );
};

export default EditMessage;
