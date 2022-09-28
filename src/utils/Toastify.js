import { Slide, toast } from 'react-toastify';
class Toastify {
    static successNotify = (msg) =>
        toast.success(msg, {
            position: 'top-right',
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            transition: Slide,
            toastId: 'success1',
        });

    static saveNotify = (msg) =>
        toast.success(msg, {
            position: 'top-right',
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            transition: Slide,
            toastId: 'save1',
        });

    static updateNotify = (msg) =>
        toast.success(msg, {
            position: 'top-right',
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            transition: Slide,
            toastId: 'update1',
        });

    static errorNotify = (msg) =>
        toast.error(msg, {
            position: 'top-right',
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            transition: Slide,
            toastId: 'error1',
        });
}

export default Toastify;
