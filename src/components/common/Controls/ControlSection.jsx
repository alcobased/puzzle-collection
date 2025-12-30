const ControlSection = ({ title, children }) => {
    return (
        <div className="control-section">
            <h4>{title}</h4>
            {children}
        </div>
    );
};

export default ControlSection;