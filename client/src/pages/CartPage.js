import React from "react";
import Layout from "../components/Layout/Layout";
import { useAuth } from "../context/auth";
import { useCart } from "../context/cart";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
  const [auth, setAuth] = useAuth();
  const [cart, setCart] = useCart();
  const navigate = useNavigate();

  // remove item
  const removeItem = (pid) => {
    try {
      const name = pid.name;
      let myCart = [...cart];
      let index = myCart.findIndex((item) => item._id === pid);
      myCart.splice(index, 1);
      setCart(myCart);
      toast(`Removed 1 item`);
      // using to remove localstorage items
      localStorage.setItem("cart", JSON.stringify(myCart));
    } catch (error) {
      console.log(error);
    }
  };

  // total price
  const totalPrice = () => {
    try {
      let total = 0;
      cart?.map((p) => {
        total = total + p.price;
      });
      return total.toLocaleString("en-IN", {
        style: "currency",
        currency: "INR",
      });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Layout>
      <div className="container mt-2">
        <h2 className="gr-black-white text-center text-light p-2 rounded fw-bold">
          Welcome {auth?.user?.name}
        </h2>
        <h5 className="bg-light text-center">
          {`You have ${cart.length} items in your cart`}
          <span className="text-danger fw-bold">
            {!auth?.user && ` Please Login to Checkout`}
          </span>
        </h5>
        {cart.length > 0 && (
          <>
            <div className="row">
              <div className="col-md-8">
                <div className="fw-bold p-2 text-center bg-secondary text-light rounded">
                  Cart Items
                </div>
                {cart.map((p) => (
                  <div key={p._id} className="p-2 m-2 border rounded">
                    <div className="row">
                      <div className="col-md-6 text-center">
                        <img
                          style={{
                            height: "150px",
                            width: "100%",
                            objectFit: "contain",
                          }}
                          src={`/api/v1/product/product-photo/${p._id}`}
                          alt=""
                        />
                      </div>
                      <div className="col-md-6">
                        <div
                          className="d-flex flex-column align-self-center justify-content-center"
                          style={{ height: "100%" }}
                        >
                          <h4>{p.name}</h4>
                          <h5>Rs. {p.price}</h5>
                          <p>{p.description}</p>
                          <button
                            className="btn btn-danger w-50"
                            onClick={() => removeItem(p._id)}
                          >
                            <i class="fa-solid fa-trash-can"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="col-md-4">
                <div className="fw-bold p-2 text-center bg-secondary text-light rounded">
                  Checkout | Payment
                </div>
                <div className="text-center pt-4">
                  <h4>Total : {totalPrice()}</h4>
                  {auth?.user?.address ? (
                    <>
                      <h5>Current Address: </h5>
                      <h6>{auth?.user?.address}</h6>
                      <Link to="/dashboard/user/manage-profile">
                        <button className="btn btn-primary">
                          Update Address
                        </button>
                      </Link>
                    </>
                  ) : (
                    <>
                      {auth?.user ? (
                        <Link to="/dashboard/user/manage-profile">
                          <button className="btn btn-primary">
                            Update Address
                          </button>
                        </Link>
                      ) : (
                          <button
                          onClick={()=>{
                            navigate('/login',{
                              state:'/cart'
                            });
                          }} className="btn btn-primary">
                            Login to continue
                          </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default CartPage;
