import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppContext from "../Context/Context";
import axios from "../axios";

const ProductList = () => {
    const { addToCart, refreshData } = useContext(AppContext);
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();

    // --- Lấy tất cả sản phẩm ---
    useEffect(() => {
        const fetchAllProducts = async () => {
            try {
                const response = await axios.get("http://localhost:8082/api/products");
                setProducts(response.data);
            } catch (error) {
                console.error("❌ Error fetching products:", error);
            }
        };
        fetchAllProducts();
    }, []);

    // --- Xóa sản phẩm ---
    const deleteProduct = async (id) => {
        if (!window.confirm("Bạn có chắc muốn xóa sản phẩm này?")) return;

        try {
            await axios.delete(`http://localhost:8082/api/product/${id}`);
            setProducts(products.filter((p) => p.id !== id));
            alert("🗑️ Product deleted successfully");
            refreshData();
        } catch (error) {
            console.error("❌ Error deleting product:", error);
        }
    };

    // --- Chuyển sang trang Update ---
    const handleEditClick = (id) => {
        navigate(`/product/update/${id}`);
    };

    // --- Thêm sản phẩm vào giỏ ---
    const handleAddToCart = (product) => {
        if (!product.productAvailable) {
            alert("⚠️ Sản phẩm đã hết hàng!");
            return;
        }
        addToCart(product);
        alert("✅ Product added to cart");
    };

    return (
        <div
            style={{
                backgroundColor: "#f8f9fa",
                minHeight: "100vh",
                fontFamily: "Arial, sans-serif",
            }}
        >
            {/* ✅ Thanh tiêu đề cố định luôn hiển thị */}
            <div
                style={{
                    position: "sticky",
                    top: 0,
                    zIndex: 1000,
                    backgroundColor: "#007bff",
                    color: "white",
                    textAlign: "center",
                    padding: "15px 0",
                    fontSize: "1.6rem",
                    fontWeight: "bold",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                }}
            >
                📦 Product List
            </div>

            {/* ✅ Nội dung chính */}
            <div style={{ padding: "2rem" }}>
                {products.length === 0 ? (
                    <p style={{ textAlign: "center" }}>Không có sản phẩm nào.</p>
                ) : (
                    <table
                        style={{
                            width: "100%",
                            borderCollapse: "collapse",
                            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                            backgroundColor: "#fff",
                        }}
                    >
                        <thead>
                        <tr style={{ backgroundColor: "#007bff", color: "white" }}>
                            <th style={thStyle}>ID</th>
                            <th style={thStyle}>Hình ảnh</th>
                            <th style={thStyle}>Tên sản phẩm</th>
                            <th style={thStyle}>Thương hiệu</th>
                            <th style={thStyle}>Mô tả</th>
                            <th style={thStyle}>Giá</th>
                            <th style={thStyle}>Tồn kho</th>
                            <th style={thStyle}>Trạng thái</th>
                            <th style={thStyle}>Thao tác</th>
                        </tr>
                        </thead>
                        <tbody>
                        {products.map((product) => (
                            <tr key={product.id} style={{ borderBottom: "1px solid #ddd" }}>
                                <td style={tdStyle}>{product.id}</td>

                                <td style={{ ...tdStyle, textAlign: "center" }}>
                                    {product.imageName ? (
                                        <img
                                            src={`http://localhost:8082/api/product/${product.id}/image`}
                                            alt={product.name}
                                            style={{
                                                width: "70px",
                                                height: "70px",
                                                objectFit: "cover",
                                                borderRadius: "8px",
                                            }}
                                        />
                                    ) : (
                                        <span style={{ color: "#999" }}>No image</span>
                                    )}
                                </td>

                                <td style={tdStyle}>{product.name}</td>
                                <td style={tdStyle}>{product.brand}</td>
                                <td style={{ ...tdStyle, maxWidth: "250px" }}>
                                    {product.description?.substring(0, 60)}...
                                </td>
                                <td style={{ ...tdStyle, fontWeight: "bold" }}>
                                    ${product.price}
                                </td>
                                <td style={tdStyle}>{product.stockQuantity}</td>
                                <td style={tdStyle}>
                    <span
                        style={{
                            color: product.productAvailable ? "green" : "red",
                            fontWeight: "bold",
                        }}
                    >
                      {product.productAvailable ? "Còn hàng" : "Hết hàng"}
                    </span>
                                </td>

                                <td style={{ ...tdStyle, textAlign: "center" }}>
                                    <button
                                        onClick={() => handleAddToCart(product)}
                                        style={btnBlue}
                                    >
                                        Add
                                    </button>
                                    <button
                                        onClick={() => handleEditClick(product.id)}
                                        style={btnYellow}
                                    >
                                        Update
                                    </button>
                                    <button
                                        onClick={() => deleteProduct(product.id)}
                                        style={btnRed}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

// --- CSS inline styles ---
const thStyle = {
    padding: "10px",
    border: "1px solid #ddd",
    textAlign: "center",
    fontWeight: "600",
};

const tdStyle = {
    padding: "10px",
    textAlign: "center",
    verticalAlign: "middle",
};

const btnBlue = {
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    padding: "5px 10px",
    borderRadius: "5px",
    cursor: "pointer",
    margin: "0 3px",
};

const btnYellow = {
    backgroundColor: "#ffc107",
    color: "black",
    border: "none",
    padding: "5px 10px",
    borderRadius: "5px",
    cursor: "pointer",
    margin: "0 3px",
};

const btnRed = {
    backgroundColor: "#dc3545",
    color: "white",
    border: "none",
    padding: "5px 10px",
    borderRadius: "5px",
    cursor: "pointer",
    margin: "0 3px"
};

export default ProductList;
