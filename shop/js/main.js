$(function () {
    var navigationNode = $('.navigation'),
        productList = $('.product'),
        basketNode = $('.basket'),
        navigation = new Navigation(navigationNode),
        productContent = new ProductContent(productList),
        basketContent = new BasketContent(basketNode),
        cookie = new Cookie(),
        sorting = new Sorting();
});