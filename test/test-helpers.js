const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

    function makeUsersArray() {
        return [
            {
              id: 1,
              user_name: 'test-user-1',
              full_name: 'Test user 1',
              password: 'password',
              date_created: new Date('2029-01-22T16:28:32.615Z'),
            },
            {
              id: 2,
              user_name: 'test-user-2',
              full_name: 'Test user 2',
              password: 'password',
              date_created: new Date('2029-01-22T16:28:32.615Z'),
            },
            {
              id: 3,
              user_name: 'test-user-3',
              full_name: 'Test user 3',
              password: 'password',
              date_created: new Date('2029-01-22T16:28:32.615Z'),
            },
            {
              id: 4,
              user_name: 'test-user-4',
              full_name: 'Test user 4',
              password: 'password',
              date_created: new Date('2029-01-22T16:28:32.615Z'),
            },
        ]
    }

    function cleanTables(db) {
        return db.transaction(trx =>
            trx.raw(
              `TRUNCATE
                skill,
                name,
                action,
                age,
                apparatus,
                class,
                level,
                priority,
                users
              `
        )
            .then(() =>
                Promise.all([
                    trx.raw(`ALTER SEQUENCE skill_id_seq minvalue 0 START WITH 1`),
                    trx.raw(`ALTER SEQUENCE name_id_seq minvalue 0 START WITH 1`),
                    trx.raw(`ALTER SEQUENCE action_id_seq minvalue 0 START WITH 1`),
                    trx.raw(`ALTER SEQUENCE age_id_seq minvalue 0 START WITH 1`),
                    trx.raw(`ALTER SEQUENCE class_id_seq minvalue 0 START WITH 1`),
                    trx.raw(`ALTER SEQUENCE apparatus_id_seq minvalue 0 START WITH 1`),
                    trx.raw(`ALTER SEQUENCE level_id_seq minvalue 0 START WITH 1`),
                    trx.raw(`ALTER SEQUENCE priority_id_seq minvalue 0 START WITH 1`),
                    trx.raw(`ALTER SEQUENCE users_id_seq minvalue 0 START WITH 1`),
                    trx.raw(`SELECT setval('skill_id_seq', 0)`),
                    trx.raw(`SELECT setval('name_id_seq', 0)`),
                    trx.raw(`SELECT setval('action_id_seq', 0)`),
                    trx.raw(`SELECT setval('age_id_seq', 0)`),
                    trx.raw(`SELECT setval('class_id_seq', 0)`),
                    trx.raw(`SELECT setval('apparatus_id_seq', 0)`),
                    trx.raw(`SELECT setval('level_id_seq', 0)`),
                    trx.raw(`SELECT setval('priority_id_seq', 0)`),
                    trx.raw(`SELECT setval('users_id_seq', 0)`),
                ])
            )
        )
    }

    function makeCurriculumFixtures() {
        const testUsers = makeUsersArray()
        return { testUsers }
    }

    function seedUsers(db, users) {
        const preppedUsers = users.map(user => ({
            ...user,
            password: bcrypt.hashSync(user.password, 1)
        }))
        return db.into('users').insert(preppedUsers)
            .then(() =>
            // update the auto sequence to stay in sync
            db.raw(
                `SELECT setval('users_id_seq', ?)`,
                [users[users.length - 1].id],
            )
        )
    }

    function makeApparatusArray(){
        return [
            {
                apparatus: 'lyra'
            },
            {
                apparatus: 'trapeze'
            },
            {
                apparatus: 'hammock'
            },
        ];
    }

    function makeActionArray(){
        return [
            {
                action: 'prerequisite'
            },
            {
                action: 'conditioning'
            },
            {
                action: 'skill'
            },
        ];
    }

    function makeAgeArray(){
        return [
            {
                age: 'adult'
            },
            {
                age: 'youth'
            },
            {
                age: 'early childhood'
            },
        ];
    }

    function makeClassArray(){
        return [
            {
                class: 'beats'
            },
            {
                class: 'catchers'
            },
            {
                class: 'climb'
            },
            {
                 class: 'spin'
            }
        ];
    }

    function makeLevelArray(){
        return [
            {
                level: 'intro'
            },
            {
                level: '1'
            },
            {
                level: '2'
            },
            {
                level: '3'
            },
        ];
    }

    function makePriorityArray(){
        return [
            {
                priority: 'essential'
            },
            {
                priority: 'every series'
            },
            {
                priority: 'optional'
            },
        ];
    }


    function makeNameArray(){
        return [
            {
                name: 'single knee spin'
            },
            {
                name: 'tornado spin'
            },
            {
                name: 'fun spin'
            },
            {
                name: 'pretzel drop'
            },
        ];
    }
    function makeSkillArray(){
        return [
        {
            primary_name_id: 1,
            apparatus_id: 1,
            level_id: 2,
            age_id: 1,
            priority_id: 2,
            class_id: 4,
            action_id: 3,
            details: 'example details',
            prerequisites: 'intro series',
            warm_up: 'example warm-up here',
            video: 'https://examplevideolink.com'
        },
        {
            primary_name_id: 4,
            apparatus_id: 2,
            level_id: 4,
            age_id: 1,
            priority_id: 2,
            class_id: 3,
            action_id: 3,
            details: 'example details 2',
            prerequisites: 'trapeze 2',
            warm_up: 'example warm-up 2 here',
            video: 'https://examplevideolink2.com'
        },
        ];
    }


module.exports = {
    makeUsersArray,
    makeApparatusArray,
    makeAgeArray,
    makeActionArray,
    makeClassArray,
    makeLevelArray,
    makePriorityArray,
    makeNameArray,
    makeSkillArray,

    makeCurriculumFixtures,
    cleanTables,
    seedUsers,
}