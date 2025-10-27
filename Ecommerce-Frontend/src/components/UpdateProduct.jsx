import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const UpdateProduct = () => {
    const { id } = useParams();
    const [image, setImage] = useState();
    const [updateProduct, setUpdateProduct] = useState({
        id: null,
        name: "",
        description: "",
        brand: "",
        price: "",
        category: "",
        releaseDate: "",
        productAvailable: false,
        stockQuantity: "",
    });

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`http://localhost:8082/api/product/${id}`);
                const productData = response.data;

                // ✅ Đồng bộ dữ liệu sản phẩm vào form
                setUpdateProduct({
                    id: productData.id,
                    name: productData.name || "",
                    description: productData.description || "",
                    brand: productData.brand || "",
                    price: productData.price || "",
                    category: productData.category || "",
                    releaseDate: productData.releaseDate || "",
                    productAvailable: productData.productAvailable || false,
                    stockQuantity: productData.stockQuantity || "",
                });

                // ✅ Lấy ảnh từ server (nếu có)
                const responseImage = await axios.get(
                    `http://localhost:8082/api/product/${id}/image`,
                    { responseType: "blob" }
                );
                const imageFile = await convertUrlToFile(responseImage.data, productData.imageName);
                setImage(imageFile);
            } catch (error) {
                console.error("Error fetching product:", error);
            }
        };

        fetchProduct();
    }, [id]);

    const convertUrlToFile = async (blobData, fileName) => {
        return new File([blobData], fileName, { type: blobData.type });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const updatedProductData = { ...updateProduct, id: parseInt(id) };

        const formData = new FormData();
        formData.append("imageFile", image);
        formData.append(
            "product",
            new Blob([JSON.stringify(updatedProductData)], { type: "application/json" })
        );

        try {
            await axios.put(`http://localhost:8082/api/product/${id}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            alert("✅ Product updated successfully!");
        } catch (error) {
            console.error("Error updating product:", error);
            alert("❌ Failed to update product. Please try again.");
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUpdateProduct({
            ...updateProduct,
            [name]: value,
        });
    };

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    return (
        <div className="update-product-container">
            <div className="center-container" style={{ marginTop: "7rem" }}>
                <h1>Update Product</h1>
                <form className="row g-3 pt-1" onSubmit={handleSubmit}>
                    {/* Name */}
                    <div className="col-md-6">
                        <label className="form-label">
                            <h6>Name</h6>
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            value={updateProduct.name}
                            onChange={handleChange}
                            name="name"
                        />
                    </div>

                    {/* Brand */}
                    <div className="col-md-6">
                        <label className="form-label">
                            <h6>Brand</h6>
                        </label>
                        <input
                            type="text"
                            name="brand"
                            className="form-control"
                            value={updateProduct.brand}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Description */}
                    <div className="col-12">
                        <label className="form-label">
                            <h6>Description</h6>
                        </label>
                        <textarea
                            className="form-control"
                            name="description"
                            value={updateProduct.description}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Price */}
                    <div className="col-md-4">
                        <label className="form-label">
                            <h6>Price</h6>
                        </label>
                        <input
                            type="number"
                            className="form-control"
                            name="price"
                            value={updateProduct.price}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Category */}
                    <div className="col-md-4">
                        <label className="form-label">
                            <h6>Category</h6>
                        </label>
                        <select
                            className="form-select"
                            value={updateProduct.category}
                            onChange={handleChange}
                            name="category"
                        >
                            <option value="">Select category</option>
                            <option value="laptop">Laptop</option>
                            <option value="headphone">Headphone</option>
                            <option value="mobile">Mobile</option>
                            <option value="electronics">Electronics</option>
                            <option value="toys">Toys</option>
                            <option value="fashion">Fashion</option>
                        </select>
                    </div>

                    {/* Stock Quantity */}
                    <div className="col-md-4">
                        <label className="form-label">
                            <h6>Stock Quantity</h6>
                        </label>
                        <input
                            type="number"
                            className="form-control"
                            name="stockQuantity"
                            value={updateProduct.stockQuantity}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Image */}
                    <div className="col-md-8">
                        <label className="form-label">
                            <h6>Image</h6>
                        </label>
                        <img
                            src={image ? URL.createObjectURL(image) : ""}
                            alt={updateProduct.imageName || "Product Image"}
                            style={{
                                width: "100%",
                                height: "180px",
                                objectFit: "cover",
                                marginBottom: "5px",
                            }}
                        />
                        <input
                            className="form-control"
                            type="file"
                            onChange={handleImageChange}
                            name="imageUrl"
                        />
                    </div>

                    {/* Available Checkbox */}
                    <div className="col-12">
                        <div className="form-check">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                name="productAvailable"
                                checked={updateProduct.productAvailable}
                                onChange={(e) =>
                                    setUpdateProduct({
                                        ...updateProduct,
                                        productAvailable: e.target.checked,
                                    })
                                }
                            />
                            <label className="form-check-label">Product Available</label>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="col-12">
                        <button type="submit" className="btn btn-primary">
                            Update
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
export default UpdateProduct;
