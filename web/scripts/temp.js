let jsonobj = {
    "ObjectTypes": [
      {
        "name": null,
        "enabled" : true
      },
      {
        "name": null,
        "enabled" : true
      },

      {
        "name": null,
        "enabled" : false
      },

      {
        "name": null,
        "enabled" : true
      },

      {
        "name": null,
        "enabled" : false
      },

      {
        "name": null,
        "enabled" : true
      },

      {
        "name": null,
        "enabled" : false
      },

      {
        "name": null,
        "enabled" : true
      },

      {
        "name": null,
        "enabled" : false
      },

      {
        "name": null,
        "enabled" : true
      },
        
      {
        "name": null,
        "enabled" : false
      },

      {
        "name": null,
        "enabled" : true
      }

    ],
    "Views": [
      {
        "name": null,
        "enabled": true,
        "Components": [
            {
              "name": null,
              "enabled" : false
            },

            {
              "name": null,
              "enabled" : false
            },

            {
              "name": null,
              "enabled" : false
            },

            {
              "name": null,
              "enabled" : false
            },

            {
              "name": null,
              "enabled" : false
            }

          ]
      },
      {
        "name": null,
        "enabled": true,
        "Components": [
            {
              "name": null,
              "enabled" : false
            },

            {
              "name": null,
              "enabled" : false
            },

            {
              "name": null,
              "enabled" : false
            },

            {
              "name": null,
              "enabled" : false
            },

            {
              "name": null,
              "enabled" : false
            }

          ]
      },
      {
        "name": null,
        "enabled": true,
        "Components": [
            {
              "name": null,
              "enabled" : false
            },

            {
              "name": null,
              "enabled" : false
            },

            {
              "name": null,
              "enabled" : false
            },

            {
              "name": null,
              "enabled" : false
            },

            {
              "name": null,
              "enabled" : false
            }

          ]
      },
      {
        "name": null,
        "enabled": true,
        "Components": [
            {
              "name": null,
              "enabled" : false
            },

            {
              "name": null,
              "enabled" : false
            },

            {
              "name": null,
              "enabled" : false
            },

            {
              "name": null,
              "enabled" : false
            },

            {
              "name": null,
              "enabled" : false
            }

          ]
      },
      {
        "name": null,
        "enabled": true,
        "Components": [
            {
              "name": null,
              "enabled" : false
            },

            {
              "name": null,
              "enabled" : false
            },

            {
              "name": null,
              "enabled" : false
            },

            {
              "name": null,
              "enabled" : false
            },

            {
              "name": null,
              "enabled" : false
            }

          ]
      },
      {
        "name": null,
        "enabled": true,
        "Components": [
            {
              "name": null,
              "enabled" : false
            },

            {
              "name": null,
              "enabled" : false
            },

            {
              "name": null,
              "enabled" : false
            },

            {
              "name": null,
              "enabled" : false
            },

            {
              "name": null,
              "enabled" : false
            }

          ]
      },
      {
        "name": null,
        "enabled": true,
        "Components": [
            {
              "name": null,
              "enabled" : false
            },

            {
              "name": null,
              "enabled" : false
            },

            {
              "name": null,
              "enabled" : false
            },

            {
              "name": null,
              "enabled" : false
            },

            {
              "name": null,
              "enabled" : false
            }

          ]
      }
    ]
  };

let data = []

for(let i = 0; i < jsonobj.ObjectTypes.length; ++i) {
    data.push({name: !(jsonobj.ObjectTypes[i].name === undefined | jsonobj.ObjectTypes[i].name === null | jsonobj.ObjectTypes[i].name === "") ?
        jsonobj.ObjectTypes[i].name : "тип объекта " + (i+1), enabled: jsonobj.ObjectTypes[i].enabled });
}

for(let i = 0; i < jsonobj.Views.length; ++i) {
    data.push({name: !(jsonobj.Views[i].name === undefined | jsonobj.Views[i].name === null | jsonobj.Views[i].name === "") ?
        jsonobj.Views[i].name : "Представление " + (i+1), enabled: jsonobj.Views[i].enabled });
    for(let j = 0; j < jsonobj.Views[i].Components.length; ++j) {
        data.push({name: !(jsonobj.Views[i].Components[j].name === undefined | jsonobj.Views[i].Components[j].name === null | jsonobj.Views[i].Components[j].name === "") ?
            jsonobj.Views[i].Components[j].name : "Компонент " + (i+1) + "."+(j+1), enabled: jsonobj.Views[i].Components[j].enabled });
    }
}

console.log(data);