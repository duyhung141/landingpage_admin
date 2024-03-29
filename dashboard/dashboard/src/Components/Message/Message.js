import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import DataTable from "react-data-table-component";
import { useDispatch, useSelector } from "react-redux";
import Table from "../Table/Table";
import * as MessageService from "../../Services/MessageService";
import { toast } from "react-toastify";
import Toast from "../LoadingError/Toast";
import Loading from "../LoadingError/LoadingError";

const Message = (props) => {
  const { data } = props;
  const [loading, setLoading] = useState("");
  const [tempData, setTempData] = useState([]);

  const [error, setError] = useState("");
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
  // const hangldeGetAll = async () => {
  //     setLoading(true);
  //     await VoucherService.getPay()
  //         .then((res) => {
  //             setLoading(false);
  //             setTempData(res);
  //         })
  //         .catch((error) => {
  //             setError(error);
  //         });
  // };
  const handleDelete = async (id) => {
    if (id) {
      if (window.confirm("Bạn có chắc chắn muốn xóa?")) {

        await MessageService.deletePay(id)
          .then((res) => {
            if (!toast.isActive(toastId.current)) {
              toastId.current = toast.success("Thành công!", Toastobjects);
            }
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
      name: "User",
      // selector: (row) => row.order.products[0].name,
      selector: (row) => row.user,
    },
    {
      name: "Product",
      // selector: (row) => row.order.products[0].name,
      selector: (row) => row.product,
    },
    {
      name: "Rating",
      // selector: (row) => row.order.products[0].name,
      selector: (row) => row.rating,
    },
    {
      name: "Comment",
      // selector: (row) => row.order.products[0].name,
      selector: (row) => row.comment,
    },
    {
      name: "Thumbnail",
      // selector: (row) => row.order.products[0].name,
      selector: (row) => (
        <img
          src={row.thumbnail}
          className="img-thumbnail"
          style={{ maxWidth: "50%" }}
          alt=""
        />
      ),
    },
    {
      name: "Action",
      selector: (row) => (
        <div className="d-flex" style={{ width: "450px" }}>
          <Link
            to={`/review/${row._id}/edit`}
            style={{ marginRight: "5px" }}
            // className="btn btn-sm btn-outline-success p-2 pb-3 col-md-6"
          >
            <button className="btn btn-primary">Edit</button>
          </Link>
          <button
            type="button"
            onClick={() => handleDelete(row._id)}
            className="btn btn-danger"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];
  return (
    <>
      <Toast />
      <Table data={data} columns={columns} sub={true} />
    </>
  );
};

export default Message;
