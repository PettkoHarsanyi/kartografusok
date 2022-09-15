import { Migration } from '@mikro-orm/migrations';

export class Migration20220915115053 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table `division` (`id` integer not null primary key autoincrement, `name` text not null, `created_at` datetime not null, `modified_at` datetime not null);');

    this.addSql('create table `user` (`id` integer not null primary key autoincrement, `name` text not null, `user_name` text not null, `password` text not null, `email` text null, `points` integer not null, `weekly` integer not null, `picture` text null, `banned` integer not null, `muted` integer not null, `role` integer not null, `division_id` integer null, constraint `user_division_id_foreign` foreign key(`division_id`) references `division`(`id`) on delete set null on update cascade);');
    this.addSql('create unique index `user_user_name_unique` on `user` (`user_name`);');
    this.addSql('create index `user_division_id_index` on `user` (`division_id`);');

    this.addSql('create table `game` (`id` integer not null primary key autoincrement, `game_id` integer not null, `user_id` integer not null, `game_date` date not null, `points` integer not null, `created_at` datetime not null, `modified_at` datetime not null, constraint `game_user_id_foreign` foreign key(`user_id`) references `user`(`id`) on update cascade);');
    this.addSql('create index `game_user_id_index` on `game` (`user_id`);');

    this.addSql('create table `message` (`id` integer not null primary key autoincrement, `game_id` integer not null, `user_id` integer not null, `message` text not null, `send_date` date not null, `created_at` datetime not null, `modified_at` datetime not null, constraint `message_game_id_foreign` foreign key(`game_id`) references `game`(`id`) on update cascade, constraint `message_user_id_foreign` foreign key(`user_id`) references `user`(`id`) on update cascade);');
    this.addSql('create index `message_game_id_index` on `message` (`game_id`);');
    this.addSql('create index `message_user_id_index` on `message` (`user_id`);');
  }

}
