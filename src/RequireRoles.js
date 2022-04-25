import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

function RequireRoles({ children, access_points }) {


  const user = useSelector(state => {
    const { authReducer } = state;
    return authReducer.user;
  });

  const categories = useSelector(state => {
    const { navigationReducer } = state;
    return navigationReducer.categories;
  });

  const [allowed, setAllowed] = useState(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(false);
    const isFounded = user.AccessPoints.some(ap => access_points.includes(ap));
    if (!isFounded) {
      setAllowed(false);
      setShow(true);
    } else {
      setAllowed(true);
      setShow(true);
    }
  }, [access_points, categories, user.AccessPoints]);


  return (
    show ? (allowed ? children : <div align='center'><h4>Нет доступа</h4></div>) : <></>
  );
}


export default RequireRoles;