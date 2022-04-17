export const Switch = props => {
    const { expression, children } = props
    // filter out only children with a matching prop
    let result = children.find(child => {
        return child.props.value === expression
    });
    
    // if child is not found, search for default child
    if (result === undefined) {
        result = children.find(child => {
            return child.props.value === 'default'
        });
    }

    return result;
};


export const Case = ({ children }) => {
    return children ? children : <></>;
};