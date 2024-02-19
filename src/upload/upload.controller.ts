import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Body,
} from '@nestjs/common';
import { UploadService } from './upload.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { diskStorage } from 'multer';
import { nanoid } from 'nanoid';
import { existsSync, mkdirSync } from 'fs';

/**
 * 获取文件后缀
 * @param {string} imei 文件类型，如image/jpeg
 */
export const getFileExtByImei = (imei: string) => {
  if (!imei) return '';
  const imgMatch = /image\/(\w+)/.exec(imei);
  if (imgMatch) return imgMatch[1];
};

const UPLOAD_PATH = './uploads';

@Controller('upload')
export class UploadController {
  constructor(
    private readonly uploadService: UploadService,
    private readonly configService: ConfigService,
  ) {}

  @Post('file')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: function (req, file, cb) {
          const path = req.body.path;
          const dest = path ? `${UPLOAD_PATH}/${path}` : UPLOAD_PATH;
          if (!existsSync(UPLOAD_PATH)) {
            mkdirSync(UPLOAD_PATH);
          }
          // TODO 目前只支持创建一层目录
          if (!existsSync(dest)) {
            mkdirSync(dest);
          }
          cb(null, dest);
        },
        filename: (req, file, cb) => {
          // 有type从其中取后缀，没有从文件名取后缀
          let ext = getFileExtByImei(req.body.type);
          if (!ext && file.originalname.includes('.')) {
            ext = file.originalname.split('.').pop();
          }
          ext = ext ? `.${ext}` : '';
          cb(null, `${nanoid()}${ext}`);
        },
      }),
    }),
  )
  uploadFile(@UploadedFile() file: Express.Multer.File, @Body() formData) {
    let path = formData.path;
    path = path ? `${path}/` : '';
    return this.configService.get('UPLOAD_PATH') + path + file.filename;
  }
}
