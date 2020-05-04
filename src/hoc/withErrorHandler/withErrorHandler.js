import React , {useEffect, useRef,useState} from 'react';
import Modal from '../../components/UI/Modal/Modal';
import Aux from '../Auxiliary/Auxiliary';

const withErrorHandler = (WrappedComponent, axios)=>{
    return (props)=>{
        const willMount = useRef(true);
        const [errorState,setErrorState] = useState({
            error:null
        })
        let reqInterceptors = null;
        let resInterceptors = null;

        if (willMount.current) {
            reqInterceptors = axios.interceptors.request.use(req => {
                setErrorState({error:null});
                return req
            });
            resInterceptors = axios.interceptors.response.use(res => res,error =>{
                setErrorState({error:"Error"});
            });
            willMount.current = false;        
        }
    
        useEffect(()=>{
            // axios.interceptors.request.use(req => {
            //     setErrorState({error:null});
            //     return req
            // });
    
            // axios.interceptors.response.use(res => res,error =>{
            //     console.log({...error})
            //     setErrorState({error:"Error"});
            // });

            return ()=>{
                console.log("should unmount",reqInterceptors,resInterceptors);
                axios.interceptors.request.eject(reqInterceptors);
                axios.interceptors.response.eject(resInterceptors);
            }
        },[axios])
        
        const errorConfirmedHandler = () =>{
            setErrorState({error:null});
        }

        return (
            <Aux>
                <Modal show={errorState.error} modalClosed={errorConfirmedHandler}>
                    {errorState.error ? errorState.error : null}
                </Modal>
                <WrappedComponent {...props} />
            </Aux>
        )
    }
}

export default withErrorHandler;