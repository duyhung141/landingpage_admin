import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Toast from "../LoadingError/Toast";
import { useMutationHooks } from "../../hooks/useMutationHooks";
import * as VoucherService from "../../Services/VoucherService";
import * as ProductService from "../../Services/ProductService";
import axios from "axios";

const AddVoucherMain = () => {
  const [user, setUser] = useState("");
  const [product, setProduct] = useState("");
  const [rating, setRating] = useState("");
  const [comment, setContentReview] = useState("");
  const [listProduct, setListProduct] = useState([]);
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
  const [images, setImages] = useState([]);

  const handleFileInputChange = (event) => {
    const selectedImages = Array.from(event.target.files);
    setImages(selectedImages);
  };
  const mutationAddCategory = useMutationHooks((data) => {
    const { access_token, ...rests } = data;
    const res = VoucherService.createReview(rests);
    return res;
  });

  const hangldeGetAllProdut = async () => {
    const resProduct = await ProductService.getAll();
    if (resProduct) {
      setListProduct(resProduct);
    }
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    if (user === "" && product === "" && rating === "" && comment === "") {
      if (!toast.isActive(toastId.current)) {
        toastId.current = toast.error("Không được để trống!", Toastobjects);
      }
    } else {
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
          uploadedImageUrls = (response.data.secure_url);
        }
      } catch (error) {
        console.log(error);
      }
      mutationAddCategory.mutate({
        user,
        product,
        rating,
        comment,
        thumbnail: uploadedImageUrls
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

  useEffect(() => {
    hangldeGetAllProdut();
  }, []);
  return (
    <>
      <Toast />
      <section className="content-main" style={{ maxWidth: "1200px" }}>
        <form onSubmit={submitHandler}>
          <div className="content-header">
            <Link to="/review" className="btn btn-danger text-white">
              Quay lại
            </Link>
            <h2 className="content-title">Thêm review</h2>
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
                      onChange={(e)=>setProduct(e.target.value)}
                    >
                        <option selected>Chọn sản phẩm</option>
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
                  <div className="mb-4">
                    <label htmlFor="expiryDays" className="form-label">
                      Ảnh review
                    </label>
                    <input
                      class="form-control"
                      type="file"
                      id="formFileMultiple"
                      onChange={handleFileInputChange}
                      multiple
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
export default AddVoucherMain;
