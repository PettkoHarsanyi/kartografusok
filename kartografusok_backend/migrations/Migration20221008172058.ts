import { Migration } from '@mikro-orm/migrations';

export class Migration20221008172058 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table `division` (`id` integer not null primary key autoincrement, `name` text not null, `created_at` datetime not null, `modified_at` datetime not null);');

    this.addSql('create table `game` (`id` integer not null primary key autoincrement, `duration` integer null, `created_at` datetime not null, `modified_at` datetime not null);');

    this.addSql('create table `user` (`id` integer not null primary key autoincrement, `name` text not null, `user_name` text not null, `password` text not null, `email` text null, `points` integer not null, `weekly` integer not null, `picture` text null, `banned` integer not null, `muted` integer not null, `role` integer not null, `division_id` integer null, `created_at` datetime not null, `modified_at` datetime not null, constraint `user_division_id_foreign` foreign key(`division_id`) references `division`(`id`) on delete set null on update cascade);');
    this.addSql('create unique index `user_user_name_unique` on `user` (`user_name`);');
    this.addSql('create index `user_division_id_index` on `user` (`division_id`);');

    this.addSql('create table `result` (`id` integer not null primary key autoincrement, `game_id` integer null, `user_id` integer not null, `points` integer null, `place` integer null, `created_at` datetime not null, `modified_at` datetime not null, constraint `result_game_id_foreign` foreign key(`game_id`) references `game`(`id`) on delete set null on update cascade, constraint `result_user_id_foreign` foreign key(`user_id`) references `user`(`id`) on update cascade);');
    this.addSql('create index `result_game_id_index` on `result` (`game_id`);');
    this.addSql('create index `result_user_id_index` on `result` (`user_id`);');

    this.addSql('create table `message` (`id` integer not null primary key autoincrement, `game_id` integer null, `user_id` integer not null, `message` text not null, `created_at` datetime not null, `modified_at` datetime not null, constraint `message_game_id_foreign` foreign key(`game_id`) references `game`(`id`) on delete set null on update cascade, constraint `message_user_id_foreign` foreign key(`user_id`) references `user`(`id`) on update cascade);');
    this.addSql('create index `message_game_id_index` on `message` (`game_id`);');
    this.addSql('create index `message_user_id_index` on `message` (`user_id`);');

    this.addSql('create table `game_users` (`game_id` integer not null, `user_id` integer not null, constraint `game_users_game_id_foreign` foreign key(`game_id`) references `game`(`id`) on delete cascade on update cascade, constraint `game_users_user_id_foreign` foreign key(`user_id`) references `user`(`id`) on delete cascade on update cascade, primary key (`game_id`, `user_id`));');
    this.addSql('create index `game_users_game_id_index` on `game_users` (`game_id`);');
    this.addSql('create index `game_users_user_id_index` on `game_users` (`user_id`);');
  }

}
