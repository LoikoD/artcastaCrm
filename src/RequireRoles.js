import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

function RequireRoles({ access_point, children }) {


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
    if (!user.AccessPoints.includes(access_point)) {
      setAllowed(false);
      setShow(true);
    } else {
      setAllowed(true);
      setShow(true);
    }
  }, [access_point, categories, user.AccessPoints]);


  return (
    show ? (allowed ? children : <div align='center'><h4>Нет доступа</h4></div>) : <></>
  );
}


export default RequireRoles;