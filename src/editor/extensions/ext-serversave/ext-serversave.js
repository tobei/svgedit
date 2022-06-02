const name = "serversave";

export default {
  name,
  async init(_S) {
    const svgEditor = this;
    const { svgCanvas } = svgEditor;
    const { $id } = svgCanvas;
    //await loadExtensionTranslation(svgEditor);

    const clickSave = async function (type, _) {
      const params = new URLSearchParams(document.location.search);
      const image_url = params.get("url");
      console.log(image_url);

      svgCanvas.clearSelection();
      const svg = '<?xml version="1.0"?>\n' + svgCanvas.svgCanvasToString();
      const image_data = new Blob([svg], {type: 'image/svg+xml'});

      const form_data = new FormData();
      form_data.append('image', image_data);

      let result = await fetch(image_url, {body: form_data, method: "PUT"});
      console.log(result);
      if (result.ok) {
        const slide_id = (await result.json()).sid;
        location.href = `http://localhost/admin/slides/${slide_id}`;
      }
    };

    return {
      name: 'server save', //svgEditor.i18next.t(`${name}:name`),
      // The callback should be used to load the DOM with the appropriate UI items
      callback() {
        const saveButtonTemplate = `<se-menu-item id="tool_server_save" label="Update slide" shortcut="S" src="saveImg.svg"></se-menu-item>`;
        svgCanvas.insertChildAtIndex($id('main_button'), saveButtonTemplate, 0);
        $id("tool_server_save").addEventListener("click", clickSave.bind(this, "save"));
      }
    };
  }
};
