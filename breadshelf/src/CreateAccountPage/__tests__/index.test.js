import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import CreateAccountFormBase from './../CreateAccountFormBase';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

describe('test validation functions', () => {

    test('test valid name input', () => {
        const wrapper = shallow(<CreateAccountFormBase />);
        const validName1 = "Noah";
        const validName2 = "noah";
        const validName3 = "Peyton Reid";
        const validName4 = "Peyton-Reid";
        

        expect(wrapper.instance().validateName(validName1)).toBe(true);
        expect(wrapper.instance().validateName(validName2)).toBe(true);
        expect(wrapper.instance().validateName(validName3)).toBe(true);
        expect(wrapper.instance().validateName(validName4)).toBe(true);

    });
    
    test('test invalid name input', () => {
        const wrapper = shallow(<CreateAccountFormBase />);
        const invalidName1 = "\\Noah";
        const invalidName2 = "noah!";
        const invalidName3 = "Noah C1";
        const invalidName4 = "<script src='inject'/>";

        expect(wrapper.instance().validateName(invalidName1)).toBe(false);
        expect(wrapper.instance().validateName(invalidName2)).toBe(false);
        expect(wrapper.instance().validateName(invalidName3)).toBe(false);
        expect(wrapper.instance().validateName(invalidName4)).toBe(false);
    });

    test('test valid email input', () => {
        const wrapper = shallow(<CreateAccountFormBase />);
        const validEmail1 = "firstlast@gmail.com";
        const validEmail2 = "first-last@none.org";
        const validEmail3 = "f_i.r-s!t@test.cn";

        expect(wrapper.instance().validateEmail(validEmail1)).toBe(true);
        expect(wrapper.instance().validateEmail(validEmail2)).toBe(true);
        expect(wrapper.instance().validateEmail(validEmail3)).toBe(true);
    });

    test('test invalid email input', () => {
        const wrapper = shallow(<CreateAccountFormBase />);
        const invalidEmail1 = "first@last@gmail.com";
        const invalidEmail2 = "first-last@none";
        const invalidEmail3 = "f_i.r-s!t.test.cn";
        const invalidEmail4 = "firstlast#gmail.com";
        const invalidEmail5 = "<script src='1'/>";

        expect(wrapper.instance().validateEmail(invalidEmail1)).toBe(false);
        expect(wrapper.instance().validateEmail(invalidEmail2)).toBe(false);
        expect(wrapper.instance().validateEmail(invalidEmail3)).toBe(false);
        expect(wrapper.instance().validateEmail(invalidEmail4)).toBe(false);
        expect(wrapper.instance().validateEmail(invalidEmail5)).toBe(false);
    });

    test('test valid username input', () => {
        const wrapper = shallow(<CreateAccountFormBase />);
        const validUsername1 = "firstlast";
        const validUsername2 = "first.last12";
        const validUsername3 = "first-last9";
        const validUsername4 = "first_last";

        expect(wrapper.instance().validateUsername(validUsername1)).toBe(true);
        expect(wrapper.instance().validateUsername(validUsername2)).toBe(true);
        expect(wrapper.instance().validateUsername(validUsername3)).toBe(true);
        expect(wrapper.instance().validateUsername(validUsername4)).toBe(true);
    });

    test('test invalid username input', () => {
        const wrapper = shallow(<CreateAccountFormBase />);
        const invalidUsername1 = "first last";
        const invalidUsername2 = "first#name!";
        const invalidUsername3 = "!~@#%@#$^!";
        const invalidUsername4 = "<script src='1'/>";

        expect(wrapper.instance().validateUsername(invalidUsername1)).toBe(false);
        expect(wrapper.instance().validateUsername(invalidUsername2)).toBe(false);
        expect(wrapper.instance().validateUsername(invalidUsername3)).toBe(false);
        expect(wrapper.instance().validateUsername(invalidUsername4)).toBe(false);
    });

    test('test valid password input', () => {
        const wrapper = shallow(<CreateAccountFormBase />);
        const validPassword1 = "Valid12";
        const validPassword2 = "Pa.!#7@$[]";
        const validPassword3 = "Valid^&*()3";

        expect(wrapper.instance().validatePassword(validPassword1)).toBe(true);
        expect(wrapper.instance().validatePassword(validPassword2)).toBe(true);
        expect(wrapper.instance().validatePassword(validPassword3)).toBe(true);
    });

    test('test invalid password input', () => {
        const wrapper = shallow(<CreateAccountFormBase />);
        const invalidPassword1 = "invalid~123";
        const invalidPassword2 = "`-!@#&^%$";
        const invalidPassword3 = "<script src='inject'/>";

        expect(wrapper.instance().validatePassword(invalidPassword1)).toBe(false);
        expect(wrapper.instance().validatePassword(invalidPassword2)).toBe(false);
        expect(wrapper.instance().validatePassword(invalidPassword3)).toBe(false);
    });

    test('test strong password input', () => {
        const wrapper = shallow(<CreateAccountFormBase />);
        const strongPass1 = "Pass05";
        const strongPass2 = "P@s$1$";
        const strongPass3 = "!@#$%^&)(*Pass1";

        expect(wrapper.instance().isWeakPassword(strongPass1)).toBe(false);
        expect(wrapper.instance().isWeakPassword(strongPass2)).toBe(false);
        expect(wrapper.instance().isWeakPassword(strongPass3)).toBe(false);
    });

    test('test weak password input', () => {
        const wrapper = shallow(<CreateAccountFormBase />);
        const weakPass1 = "pass12";
        const weakPass2 = "PASSS12";
        const weakPass3 = "Password";
        const weakPass4 = "1!@#PASS";
        const weakPass5 = "St5";

        expect(wrapper.instance().isWeakPassword(weakPass1)).toBe(true);
        expect(wrapper.instance().isWeakPassword(weakPass2)).toBe(true);
        expect(wrapper.instance().isWeakPassword(weakPass3)).toBe(true);
        expect(wrapper.instance().isWeakPassword(weakPass4)).toBe(true);
        expect(wrapper.instance().isWeakPassword(weakPass5)).toBe(true);
    });
});