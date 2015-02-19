define(['views/MenuList', 'views/ButtonMenu', 'views/InputMenu', 'views/SubMenu', 'views/CheckMenu'],
function (MenuListView, ButtonMenuView, InputMenuView, SubMenuView, CheckMenuView) {
	var MenuView = MenuListView;
	MenuView.menuMap = {
		button		: ButtonMenuView,
		input		: InputMenuView,
		menu		: SubMenuView,
		check		: CheckMenuView,
	};
	return MenuView;
});