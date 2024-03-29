import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Toast from "../LoadingError/Toast";
import axios from "axios";
import { useMutationHooks } from "../../hooks/useMutationHooks";
import * as ProductService from "../../Services/ProductService";
import { EditorState, convertToRaw, ContentState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

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
  const [listCategory, setListCategory] = useState([]);
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  const apiUrl = process.env.REACT_APP_SERVER_URL;
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
    const res = ProductService.createProduct(rests);
    return res;
  });

  const submitHandler = async (event) => {
    event.preventDefault();
    if (name === "" || category === "" || description === "" || price === 0) {
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

 

  const onEditorStateChange = (newEditorState) => {
    setEditorState(newEditorState);
    setDescription(
      draftToHtml(convertToRaw(newEditorState.getCurrentContent()))
    );
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

  useEffect(() => {
    const fetchData = async () => {
      const dataCategory = await axios.get(`${apiUrl}/api/v1/category`);

      if (dataCategory) {
        setListCategory(dataCategory.data);
      }
    };
    fetchData();
  }, []);
  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };
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
                        const selectedValue = e.target.value;
                        setCategory(selectedValue);
                      }}
                    >
                      <option value="1">Choose category</option>
                      {listCategory.map((item, index) => (
                        <option
                          key={index}
                          value={item.name}
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
                    {/* <input
                      type="text"
                      placeholder="Type here"
                      className="form-control"
                      id="product_price"
                      required
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    /> */}
                    <Editor
                      editorState={editorState}
                      wrapperClassName="demo-wrapper"
                      editorClassName="demo-editor"
                      onEditorStateChange={onEditorStateChange}
                    />
                    <textarea
                      className="form-control"
                      value={description}
                      onChange={handleDescriptionChange}
                      rows="3"
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
