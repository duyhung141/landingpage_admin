import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Toast from "../LoadingError/Toast";
import Message from "../LoadingError/Error";
import Loading from "../LoadingError/LoadingError";
import axios from "axios";
import { useMutationHooks } from "../../hooks/useMutationHooks";
import * as ProductService from "../../Services/ProductService";
import * as CategoryService from "../../Services/CategoryService";

import { fetchAsyncProducts } from "../../features/productSlide/productSlice";

const ToastObjects = {
  pauseOnFocusLoss: false,
  draggable: false,
  pauseOnHover: false,
  autoClose: 2000,
};
const AddProductMain = () => {
  const [name, setName] = useState("");
  const [percentSale, setPercentSale] = useState(0);
  const [price, setPrice] = useState(0);
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [listCategory, setListCategory] = useState([
    {
      name: "Đồ điện tử",
    },
    {
      name: "Đồ gia dụng",
    }
  ])
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
  const handleFileInputChange = (event) => {
    const selectedImages = Array.from(event.target.files);
    setImages(selectedImages);
  };
  const mutationAddProduct = useMutationHooks((data) => {
    const { ...rests } = data;
    const res = ProductService.createProduct( rests );
    return res;
  });

  const submitHandler = async (event) => {
    event.preventDefault();
    if (
      name === "" ||
      category === "" ||
      description === "" ||
      price === 0 
    ) {
      if (!toast.isActive(toastId.current)) {
        toastId.current = toast.error("Không được để trống!", Toastobjects);
      }
    } else {
      const uploadedImageUrls = [];

      try {
        for (const image of images) {
          const formData = new FormData();
          formData.append("file", image);
          formData.append("upload_preset", "Project1");

          const response = await axios.post(
            `https://api.cloudinary.com/v1_1/dgeeyhyzq/image/upload`,
            formData
          );
          uploadedImageUrls.push(response.data.secure_url);
        }
      } catch (error) {
        console.log(error);
      }
      mutationAddProduct.mutate({
        name,
        category,
        description,
        price,
        percentSale,
        urlList: uploadedImageUrls,
      });
    }
  };

  const { error, isLoading, isSuccess, isError } = mutationAddProduct;
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
            <Link to="/products" className="btn btn-danger text-white">
              Về trang sản phẩm
            </Link>
            <h2 className="content-title">Thêm sản phẩm</h2>
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
                    <label htmlFor="product_title" className="form-label">
                      Tên sản phẩm
                    </label>
                    <input
                      type="text"
                      placeholder="Tên sản phẩm"
                      className="form-control"
                      id="product_title"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="product_price" className="form-label">
                      Danh mục
                    </label>
                    <select
                      className="form-select text-capitalize"
                      aria-label="Default select example"
                      onChange={(e) => {
                        const selectedValue = (e.target.value);
                        setCategory(selectedValue);
                      }}
                    >
                      <option value="1">Choose category</option>
                      {listCategory.map((item, index) => (
                        <option
                          key={index}
                          value={ item.name}
                          className="text-capitalize"
                        >
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-4">
                    <label htmlFor="product_price" className="form-label">
                      Mô tả
                    </label>
                    <input
                      type="text"
                      placeholder="Type here"
                      className="form-control"
                      id="product_price"
                      required
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>
                  <div className="mb-4">
                    <label className="form-label">Giá Gốc</label>
                    <input
                      type="number"
                      placeholder="Type here"
                      className="form-control"
                      onChange={(e) => setPrice(e.target.value)}
                    ></input>
                  </div>
                  <div className="mb-4">
                    <label className="form-label">Percent Sale</label>
                    <input
                      type="number"
                      placeholder="Type here"
                      className="form-control"
                      onChange={(e) => setPercentSale(e.target.value)}
                    ></input>
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

export default AddProductMain;
