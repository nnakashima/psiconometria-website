/// <reference path="../pb_data/types.d.ts" />

migrate(
  (app) => {
    try {
      app.findCollectionByNameOrId("contacts");
      return;
    } catch (_) {
      // create below
    }
    const collection = new Collection({
      type: "base",
      name: "contacts",
      // Public write-only: anyone can submit the contact/newsletter form,
      // nobody can read submissions through the API (superuser only).
      listRule: null,
      viewRule: null,
      createRule: "",
      updateRule: null,
      deleteRule: null,
      fields: [
        { name: "nome", type: "text", required: true, max: 120 },
        { name: "email", type: "email", required: true },
        { name: "empresa", type: "text", max: 160 },
        {
          name: "interesse",
          type: "select",
          required: true,
          maxSelect: 1,
          values: [
            "diagnostico",
            "projeto-piloto",
            "conteudo-pesquisa",
            "consultoria",
            "colaboracao-academica",
            "newsletter",
          ],
        },
        { name: "mensagem", type: "text", max: 2000 },
        { name: "origem", type: "text", max: 120 },
        { name: "created", type: "autodate", onCreate: true, onUpdate: false },
        { name: "updated", type: "autodate", onCreate: true, onUpdate: true },
      ],
      indexes: ["CREATE INDEX idx_contacts_created ON contacts (created)"],
    });
    app.save(collection);
  },
  (app) => {
    try {
      const collection = app.findCollectionByNameOrId("contacts");
      app.delete(collection);
    } catch (e) {
      if (e.message.includes("no rows in result set")) {
        console.log("Collection not found, skipping revert");
        return;
      }
      throw e;
    }
  },
);
