import "./AddingProduct.css";

const AddingProduct = () => {
  return (
    <div className="adding-overlay">
      <div className="adding-box">
        <div className="spinner"></div>
        <p>Adding product...</p>
      </div>
    </div>
  );
};

export default AddingProduct;
