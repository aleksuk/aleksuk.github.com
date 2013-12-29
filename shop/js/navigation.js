var Navigation = (function (location, Mediator, $) {
    function Navigation(navigationNode) {
        var self = this;

        this.navigationNode = navigationNode;
        this.mediator = new Mediator();
        this.setActiveTab();
        
        function changeDepartment(event) {
            self.setActiveTab(this);
            self.mediator.publish('processedContent', this.href);
        }

        navigationNode.on('click', 'a', changeDepartment);
    }

    Navigation.prototype.setActiveTab = function (link) {
        var linksNode = this.navigationNode.find('a');
        this.navigationNode.find('li').removeClass('active');

        if (link) {
            $(link).parent().addClass('active');
        } else {
            for (var i = 0; i < linksNode.length; i += 1) {
                if (linksNode.get(i).href === location.href) {
                    linksNode.eq(i).parent().addClass('active');
                    return;
                } 
            }
            linksNode.eq(0).parent().addClass('active');
        }
    }

    return Navigation;
})(window.location, Mediator, window.jQuery);
