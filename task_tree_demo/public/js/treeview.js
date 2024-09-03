// frappe.views.TreeFactory = class KaramTreeFactory extends frappe.views.Factory {
frappe.views.TreeView = class KaramTreeView extends frappe.views.TreeView {
    make_tree() {
		$(this.parent).find(".tree").remove();

		var use_label = this.args[this.opts.root_label] || this.root_label || this.opts.root_label;
		var use_value = this.root_value;
		if (use_value == null) {
			use_value = use_label;
		}

		if (this.page?.inner_toolbar) {
			this.args["include_disabled"] = this.page.inner_toolbar
				.find("input[type='checkbox']")
				.prop("checked");
		}

		this.tree = new frappe.ui.Tree({
			parent: this.body,
			label: use_label,
			root_value: use_value,
			expandable: true,

			args: this.args,
			method: this.get_tree_nodes,

			toolbar: this.get_toolbar(),

			get_label: this.opts.get_label,
			on_render: this.opts.onrender,
			on_get_node: this.opts.on_get_node,
			on_click: (node) => {
				this.select_node(node);
				if(this.doctype == "Task" && node.data.value!="All Tasks"){
					
					frappe.db.get_list("Task",{filters : {"name": node.data.value},fields:["name","priority","status","description"]}).then((res)=>{
						let msg = "Priority : "+res[0].priority+",\nStatus: "+res[0].status+",\nDescription: "+res[0].description
						frappe.msgprint(msg)
					})
				}
			},
		});

		cur_tree = this.tree;
		cur_tree.view_name = "Tree";
		this.post_render();
	}
}