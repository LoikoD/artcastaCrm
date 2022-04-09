import './styles/LoadingOverlay.css';

function LoadingOverlay(props) {

    const visibility = props.show === 0 ? 'collapse' : 'visible';

    return(
        <div className='spinner' style={{visibility: visibility}}><div className="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div></div>
    )
}
 

export default LoadingOverlay;