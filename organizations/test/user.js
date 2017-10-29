'use strict';


const should = require('chai').should();
const expect = require('chai').expect;
const supertest = require('supertest');

//初始化数据库


const app = "http://127.0.0.1:8080";

describe('用户系统测试', function () {


    
    before(function(done){
        supertest(app)
            .get('/api/mode/init?mode=User')
            .expect(200,done)
    });



    it('未注册登录:admin/123456应该失败', function(done) {
        supertest(app)
            .post('/api/user/login?')
            .send({"username":"admin","password":"123456"})
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function(err, res){
                console.log(res.body)
                expect(res.body).to.have.property('success');
                expect(res.body.success).to.equal(false);
                expect(res.body).to.have.property('error');
                expect(res.body.error).to.have.property('code');
                expect(res.body.error.code).to.equal(2010);
                done();
            })
    });


    it('第一次注册admin/123456应该成功', function(done) {
        supertest(app)
            .post('/api/user/regist?')
            .send({"username":"admin","password":"123456"})
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect("body.success",false)
            .expect(200)
            .end(function(err, res){
                expect(res.body).to.have.property('success');
                expect(res.body.success).to.equal(true);
                expect(res.body).to.have.property('data');
                expect(res.body.data).to.have.property('username');
                expect(res.body.data.username).to.equal("admin");
                expect(res.body.data).to.not.have.property('password');
                done();
             })
    });

    it('第二次注册admin/123456应该失败', function(done) {
        supertest(app)
            .post('/api/user/regist?')
            .send({"username":"admin","password":"123456"})
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect("body.success",false)
            .expect(200)
            .end(function(err, res){
                expect(res.body).to.have.property('success');
                expect(res.body.success).to.equal(false);
                expect(res.body).to.have.property('error');
                expect(res.body.error).to.have.property('code');
                expect(res.body.error.code).to.equal(2001);
                done();
            })
    });


    it('注册后登录:admin/123456应该成功', function(done) {
        supertest(app)
            .post('/api/user/login')
            .send({"username":"admin","password":"123456"})
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect("body.success",false)
            .expect(200)
            .end(function(err, res){
                // console.log(res.body)
                expect(res.body).to.have.property('success');
                expect(res.body.success).to.equal(true);
                expect(res.body).to.have.property('data');
                expect(res.body.data).to.have.property('username');
                expect(res.body.data).to.not.have.property('password');
                expect(res.body.data.username).to.equal("admin");
                done();
            })
    });


    it('修改密码:admin/654321 应该成功', function(done) {
        supertest(app)
            .post('/api/user/repass?')
            .send({"username":"admin","password":"654321","oldpass":"123456"})
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect("body.success",false)
            .expect(200)
            .end(function(err, res){
                // console.log(res.body)
                expect(res.body).to.have.property('success');
                expect(res.body.success).to.equal(true);
                expect(res.body).to.have.property('data');
                expect(res.body.data).to.have.property('username');
                done();
            })
    });

    it('修改密码后登录:admin/654321应该成功', function(done) {
        supertest(app)
            .post('/api/user/login?')
            .send({"username":"admin","password":"654321"})
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect("body.success",false)
            .expect(200)
            .end(function(err, res){
                // console.log(res.body)
                expect(res.body).to.have.property('success');
                expect(res.body.success).to.equal(true);
                expect(res.body).to.have.property('data');
                expect(res.body.data).to.have.property('username');
                expect(res.body.data).to.not.have.property('password');
                expect(res.body.data.username).to.equal("admin");
                done();
            })
    });

});
