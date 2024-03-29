import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../LoadingError/LoadingError";
import * as ProductService from "../../Services/ProductService";
import Table from "../Table/Table";
import { toast } from "react-toastify";
import Toast from "./../LoadingError/Toast";

const MainProducts = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  // const productList = useSelector((state) => state.products);
  // const { productsStatus } = productList;
  const [tempData, setTempData] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [search, SetSearch] = useState("");
  const handleCloseModal = () => setShowModal(false);

  // const productDelete = useSelector((state) => state.productDelete);
  // const { error: errorDelete, success: successDelete } = productDelete;
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
  const options = {
    maximumFractionDigits: 0,
  };
  const formattedAmount = (amount, options) => {
    return amount.toLocaleString(undefined, options);
  };
  const handleDelete = async (id) => {
    if (id) {
      if (window.confirm("Bạn có chắc chắn muốn xóa?")) {
        await ProductService.deleteProduct(id)
          .then((res) => {
            if (!toast.isActive(toastId.current)) {
              toastId.current = toast.success("Thành công!", Toastobjects);
            }
            hangldeGetAll();
            window.location.reload();
          })
          .catch((error) => {
            if (!toast.isActive(toastId.current)) {
              toastId.current = toast.error(error, Toastobjects);
            }
          });
      }
    }
  };
  const columns = [
    {
      name: "Link tới web",
      selector: (row) => (
        <Link to="">{row._id}</Link>
      ),
    },
    {
      name: "Ảnh",
      selector: (row) => (
        <img
          src={row.urlList[0]}
          // alt={row.title}
          class="img-thumbnail"
          style={{ maxWidth: "50%" }}
        />
      ),
    },
    {
      name: "Tên sản phẩm",
      selector: (row) => row.name,
    },
    {
      name: "Mô tả",
      selector: (row) => row.description,
    },
    {
      name: "Danh mục",
      selector: (row) => row.category,
    },
    {
      name: "Giá gốc",
      selector: (row) => formattedAmount(row.price),
    },
    {
      name: "Percent Sale",
      selector: (row) => (row.percentSale),
    },
    {
      name: "Đánh giá",
      selector: (row) => '5',
    },
    {
      name: "Hành động",
      selector: (row) => (
        <>
          <Link
            to={`/product/${row._id}/edit`}
            // className="btn btn-sm btn-outline-success p-2 pb-3 col-md-6"
          >
            <button className="btn btn-warning">Sửa</button>
          </Link>
          <Link
            style={{ marginLeft: "15px" }}
            onClick={() => handleDelete(row._id)}
            // className="btn btn-sm btn-outline-success p-2 pb-3 col-md-6"
          >
            <button className="btn btn-danger">Xóa</button>
          </Link>
        </>
      ),
    },
  ];
  const hangldeGetAll = async () => {
    setLoading(true);
    const resProduct = await ProductService.getAll();
    setLoading(false);
    setTempData(resProduct);

    // dispatch(updatePay(res));
  };
  useEffect(() => {
    if (search === "") {
      hangldeGetAll();
    } else {
      const result = tempData.filter((idProduct) => {
        return idProduct.id.toString().match(search.toLowerCase());
      });
      console.log(result);
      setTempData(result);
    }
  }, [search]);

  return (
    <>
      <Toast />
      <section className="content-main">
        <div className="content-header">
          <h2 className="content-title">Sản phẩm</h2>
          <div>
            <Link to="/addproduct" className="btn btn-primary">
              Thêm mới
            </Link>
          </div>
        </div>

        <div className="card mb-4 shadow-sm">
          <div className="card-body">
            {loading ? (
              <Loading />
            ) : (
              <div className="row">
                <Table data={tempData} columns={columns} sub={true} />
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default MainProducts;
