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
  const [rate, setRate] = useState(0);
  const dispatch = useDispatch();
  const [priceOld, setPriceOld] = useState(0);
  const [priceReal, setPriceReal] = useState(0);
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [idCategory, setIdCategory] = useState("");
  const [material, setMaterial] = useState("");
  const [origin, setOrigin] = useState("");
  const [ageTram, setAgeTram] = useState("");
  const [howToUse, setHowToUse] = useState("");
  const [soLuongHat, setSoLuongHat] = useState("");
  const [loaiCharm, setLoaiCharm] = useState("");
  const [slug, setSlug] = useState("");
  const [forGender, setForGender] = useState("");
  const [size, setSize] = useState("");
  const [quantity, setQuantity] = useState("");

  const [loading, setLoading] = useState(false);
  const [tempData, setTempData] = useState([]);
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
    const { access_token, ...rests } = data;
    const res = ProductService.createProduct( rests, access_token );
    return res;
  });

  const submitHandler = async (event) => {
    event.preventDefault();
    if (
      name === "" ||
      category === "" ||
      description === "" ||
      priceReal === 0 ||
      rate === 0
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
      const access_token = localStorage.getItem("access_token")
      mutationAddProduct.mutate({
        name,
        category,
        description,
        priceOld,
        priceReal,
        rate,
        material,
        origin,
        old:ageTram,
        use: howToUse,
        count: soLuongHat,
        loaiCharm,
        slug,
        categoryId:idCategory,
        quantity,
        images: uploadedImageUrls,
        access_token,
      });
    }
  };
  const hangldeGetAll = async () => {
    setLoading(true);
    const resCategory = await CategoryService.getCategory();
    setLoading(false);
    setTempData(resCategory);

    // dispatch(updatePay(res));
  };
  const { error, isLoading, isSuccess, isError } = mutationAddProduct;
  useEffect(() => {
    hangldeGetAll();
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
                        const selectedValue = JSON.parse(e.target.value);
                        const selectedName =
                          selectedValue && selectedValue.name;
                        const selectedId = selectedValue && selectedValue.id;
                        setCategory(selectedName);
                        setIdCategory(selectedId);
                      }}
                    >
                      <option value="1">Choose category</option>
                      {tempData.map((item, index) => (
                        <option
                          key={item.id}
                          value={JSON.stringify({
                            name: item.name,
                            id: item._id,
                          })}
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
                    <label className="form-label">Giá gốc</label>
                    <input
                      type="number"
                      placeholder="Type here"
                      className="form-control"
                      onChange={(e) => setPriceOld(e.target.value)}
                    ></input>
                  </div>
                  <div className="mb-4">
                    <label className="form-label">Giá bán</label>
                    <input
                        type="number"
                        placeholder="Type here"
                        className="form-control"
                        onChange={(e) => setPriceReal(e.target.value)}
                    ></input>
                  </div>
                  <div
                    className={
                      category === "Vòng trầm Thiên Mộc Hương"
                        ? "mb-4"
                        : "d-none"
                    }
                  >
                    <label className="form-label">Size</label>
                    <input
                      type="number"
                      placeholder="Type here"
                      className="form-control"
                      onChange={(e) => setSize(e.target.value)}
                    ></input>
                  </div>

                  <div className="mb-4">
                    <label className="form-label">Đánh giá</label>
                    <input
                      type="number"
                      placeholder="Type here"
                      className="form-control"
                      onChange={(e) => setRate(e.target.value)}
                    ></input>
                  </div>
                  <div className="mb-4">
                    <label className="form-label">Số lượng còn</label>
                    <input
                      type="number"
                      placeholder="Type here"
                      className="form-control"
                      onChange={(e) => setQuantity(e.target.value)}
                    ></input>
                  </div>
                  <div className="mb-4">
                    <label className="form-label">Chất liệu</label>
                    <input
                      type="text"
                      placeholder="Type here"
                      className="form-control"
                      value={material}
                      onChange={(e) => setMaterial(e.target.value)}
                    ></input>
                  </div>
                  <div className="mb-4">
                    <label className="form-label">Nguồn gốc</label>
                    <select
                      className="form-select"
                      onChange={(e) => setOrigin(e.target.value)}
                    >
                      <option value="" selected disabled>
                        None
                      </option>
                      <option value="vietnam">Việt Nam</option>
                      <option value="philippines">Philippines</option>
                      <option value="indonesia">Indonesia</option>
                    </select>
                  </div>
                  <div className="mb-4">
                    <label className="form-label">Tuổi Trầm</label>
                    <input
                      type="text"
                      placeholder="Type here"
                      className="form-control"
                      value={ageTram}
                      onChange={(e) => setAgeTram(e.target.value)}
                    ></input>
                  </div>
                  <div className="mb-4">
                    <label className="form-label">Cách sử dụng</label>
                    <input
                      type="text"
                      placeholder="Type here"
                      className="form-control"
                      value={howToUse}
                      onChange={(e) => setHowToUse(e.target.value)}
                    ></input>
                  </div>
                  <div
                    className={
                      category === "Vòng trầm Thiên Mộc Hương"
                        ? "mb-4"
                        : "d-none"
                    }
                  >
                    <label className="form-label">Số lượng hạt</label>
                    <input
                      type="text"
                      placeholder="Type here"
                      className="form-control"
                      onChange={(e) => setSoLuongHat(e.target.value)}
                    ></input>
                  </div>
                  <div
                    className={
                      category === "Vòng trầm Thiên Mộc Hương"
                        ? "mb-4"
                        : "d-none"
                    }
                  >
                    <label className="form-label">Loại Charm</label>
                    <input
                      type="text"
                      placeholder="Type here"
                      className="form-control"
                      value={loaiCharm}
                      onChange={(e) => setLoaiCharm(e.target.value)}
                    ></input>
                  </div>

                  <div className="mb-4">
                    <label className="form-label">Slug</label>
                    <select
                      className="form-select"
                      onChange={(e) => setSlug(e.target.value)}
                    >
                      <option selected disabled>
                        None
                      </option>
                      <option value="vong-tram-huong-nu">
                        Vòng Trầm Hương Nữ
                      </option>
                      <option value="vong-tram-huong-nam">
                        Vòng Trầm Hương Nam
                      </option>
                      <option value="menh-moc">Mệnh Mộc</option>
                      <option value="menh-thuy">Mệnh Thủy</option>
                      <option value="menh-hoa">Mệnh Hỏa</option>
                      <option value="menh-tho">Mệnh Thổ</option>
                      <option value="menh-kim">Mệnh Kim</option>
                      <option value="nhang-vong-tram-huong">
                        Nhang Vòng Trầm Hương
                      </option>
                      <option value="nhang-vong-co-tam">
                        Nhang Vòng Có Tăm
                      </option>
                      <option value="nhang-vong-khong-tam">
                        Nhang Vòng Không Tăm
                      </option>
                    </select>
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
