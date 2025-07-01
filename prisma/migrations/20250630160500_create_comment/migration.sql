-- CreateTable
CREATE TABLE `post_comment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `post_id` INTEGER NOT NULL,
    `user_id` INTEGER NOT NULL,
    `content` VARCHAR(191) NOT NULL,
    `img_list` TEXT NULL,
    `create_time` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `update_time` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `parent_id` INTEGER NULL,
    `reply_to_id` INTEGER NULL,

    INDEX `post_comment_post_id_fkey`(`post_id`),
    INDEX `post_comment_user_id_fkey`(`user_id`),
    INDEX `post_comment_parent_id_fkey`(`parent_id`),
    INDEX `post_comment_reply_to_id_fkey`(`reply_to_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `post_comment` ADD CONSTRAINT `post_comment_post_id_fkey` FOREIGN KEY (`post_id`) REFERENCES `post`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `post_comment` ADD CONSTRAINT `post_comment_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `post_comment` ADD CONSTRAINT `post_comment_parent_id_fkey` FOREIGN KEY (`parent_id`) REFERENCES `post_comment`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `post_comment` ADD CONSTRAINT `post_comment_reply_to_id_fkey` FOREIGN KEY (`reply_to_id`) REFERENCES `post_comment`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
