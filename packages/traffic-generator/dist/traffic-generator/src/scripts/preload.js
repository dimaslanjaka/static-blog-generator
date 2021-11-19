window.addEventListener('DOMContentLoaded', function () {
    var replaceText = function (selector, text) {
        var element = document.getElementById(selector);
        if (element)
            element.innerText = text;
    };
    for (var _i = 0, _a = ['chrome', 'node', 'electron']; _i < _a.length; _i++) {
        var dependency = _a[_i];
        replaceText("".concat(dependency, "-version"), process.versions[dependency]);
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJlbG9hZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9zY3JpcHRzL3ByZWxvYWQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsTUFBTSxDQUFDLGdCQUFnQixDQUFDLGtCQUFrQixFQUFFO0lBQzFDLElBQU0sV0FBVyxHQUFHLFVBQUMsUUFBUSxFQUFFLElBQUk7UUFDakMsSUFBTSxPQUFPLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQUMsQ0FBQTtRQUNqRCxJQUFJLE9BQU87WUFBRSxPQUFPLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQTtJQUN2QyxDQUFDLENBQUE7SUFFRCxLQUF5QixVQUE4QixFQUE5QixNQUFDLFFBQVEsRUFBRSxNQUFNLEVBQUUsVUFBVSxDQUFDLEVBQTlCLGNBQThCLEVBQTlCLElBQThCLEVBQUU7UUFBcEQsSUFBTSxVQUFVLFNBQUE7UUFDbkIsV0FBVyxDQUFDLFVBQUcsVUFBVSxhQUFVLEVBQUUsT0FBTyxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFBO0tBQ25FO0FBQ0gsQ0FBQyxDQUFDLENBQUEifQ==