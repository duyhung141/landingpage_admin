import React, { useState, useEffect } from "react";
import Toast from "./../LoadingError/Toast";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Message from "../LoadingError/Error";
import Loading from "../LoadingError/LoadingError";
import * as ProductService from "../../Services/ProductService";
import { fetchAsyncProductSingle } from "../../features/productSlide/productSlice";
import { useMutationHooks } from "../../hooks/useMutationHooks";
import { updateProductSingle } from "../../features/productSlide/ProductSliceNew";
import { useQuery } from "react-query";

const EditProductMain = (props) => {
  const { id } = props;

  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [urlList, setUrlList] = useState([]);
  const [percentSale, setPercentSale] = useState("");

  const handleGetDetailsProduct = async () => {
    const res = await ProductService.getDetilsProduct(id);
    return res;
  };
  const mutation = useMutationHooks((data) => {
    const { id, access_token, ...rests } = data;
    ProductService.updateProduct(id, rests, access_token);
  });
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
  const { data, error, isLoading, isError, isSuccess } = mutation;
  const handleUpdate = (e) => {
    e.preventDefault();

    mutation.mutate({
      id: id,
      name,
      category,
      description,
      price,
      urlList
    });

    // mutation.mutate(decoded?.id, { phone, name, email, sex })
  };

  const { isLoading: getDetail, data: dataDetail } = useQuery(
    ["products"],
    handleGetDetailsProduct
  );
  useEffect(() => {
    if (dataDetail) {
      setName(dataDetail.name);
      setCategory(dataDetail.category);
      setDescription(dataDetail.description);
      setUrlList(dataDetail.urlList);
      setPrice(dataDetail.price);
      setPercentSale(dataDetail.percentSale);
    }
  }, [dataDetail]);

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
        <form onSubmit={handleUpdate}>
          <div className="content-header">
            <Link to="/products" className="btn btn-danger text-white">
              Về trang sản phẩm
            </Link>
            <h2 className="content-title">Sửa sản phẩm</h2>
            <div>
              <button type="submit" className="btn btn-primary">
                Xác nhận sửa
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
                  {getDetail ? (
                    <Loading />
                  ) : (
                    <>
                      <div className="mb-4">
                        <label htmlFor="product_price" className="form-label">
                          Name
                        </label>
                        <input
                          type="text"
                          placeholder="Type here"
                          className="form-control"
                          id="product_price"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                      </div>
                      <div className="mb-4">
                        <label htmlFor="product_price" className="form-label">
                          Danh mục
                        </label>
                        <input
                          type="text"
                          placeholder="Type here"
                          className="form-control"
                          id="product_price"
                          readOnly
                          required
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                        />
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
                        <label className="form-label">Giá gốc</label>
                        <input
                          type="number"
                          placeholder="Type here"
                          className="form-control"
                          required
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                        ></input>
                      </div>
                      <div className="mb-4">
                        <label className="form-label">Giá bán</label>
                        <input
                          type="number"
                          placeholder="Type here"
                          className="form-control"
                          required
                          value={percentSale}
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
                          // onChange={handleFileInputChange}
                          multiple
                        />
                        <div className="d-flex mt-3 ">
                          {urlList.map((item) => (
                            <img
                              src={item}
                              width="10%"
                              style={{ marginLeft: "12px" }}
                            />
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </form>
      </section>
    </>
  );
};

export default EditProductMain;
