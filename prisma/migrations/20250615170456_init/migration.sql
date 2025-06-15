-- CreateTable
CREATE TABLE `post` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `create_user_id` INTEGER NOT NULL,
    `create_time` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `content` TEXT NOT NULL,
    `img_list` TEXT NULL,
    `video` VARCHAR(500) NULL,
    `video_poster` VARCHAR(500) NULL,
    `gif_video` VARCHAR(500) NULL,
    `gif_poster` VARCHAR(500) NULL,
    `gif_width` SMALLINT NULL DEFAULT 0,
    `gif_height` SMALLINT NULL DEFAULT 0,

    INDEX `post_create_user_id_fkey`(`create_user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `post_like` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `post_id` INTEGER NOT NULL,
    `user_id` INTEGER NOT NULL,
    `liked` BOOLEAN NULL,
    `create_time` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `update_time` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `post_like_post_id_fkey`(`post_id`),
    INDEX `post_like_user_id_fkey`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `post_view` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `post_id` INTEGER NOT NULL,
    `user_id` INTEGER NOT NULL,
    `create_time` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `post_view_post_id_fkey`(`post_id`),
    INDEX `post_view_user_id_fkey`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `following_num` INTEGER NOT NULL DEFAULT 0,
    `follower_num` INTEGER NOT NULL DEFAULT 0,
    `user_name` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `full_name` VARCHAR(255) NOT NULL DEFAULT '',
    `avatar` VARCHAR(255) NOT NULL DEFAULT '',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `post` ADD CONSTRAINT `post_create_user_id_fkey` FOREIGN KEY (`create_user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `post_like` ADD CONSTRAINT `post_like_post_id_fkey` FOREIGN KEY (`post_id`) REFERENCES `post`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `post_like` ADD CONSTRAINT `post_like_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `post_view` ADD CONSTRAINT `post_view_post_id_fkey` FOREIGN KEY (`post_id`) REFERENCES `post`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `post_view` ADD CONSTRAINT `post_view_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
