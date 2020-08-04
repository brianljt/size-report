drop table if exists commitinfo;
drop table if exists filechange;

create table commitinfo (
    id varchar primary key not null,
    created_at timestamp not null default CURRENT_TIMESTAMP,
    parent_id varchar
    /*reponame  varchar, # to be revised: is it needed? */
    /*message varchar not null default '', # to be revised: is it needed? */
    /*revision varchar not null primary key,
    build varchar not null primary key, 
    parent_revision varchar not null*/
);

create table filechange (
    commit_id varchar not null,
    file_name varchar not null,
    textsize integer not null,
    datasize integer not null,
    bsssize integer not null,
    totalsize integer not null,
    foreign key (commit_id) references commitinfo (id)
);

