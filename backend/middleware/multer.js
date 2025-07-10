import multer, { diskStorage } from 'multer';

const storage=multer.diskStorage({
    diskStorage:function(req,file,callback){
        callback(null,file.originalname);
    }
});

const upload=multer({storage});

export default upload;

