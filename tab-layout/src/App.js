import React, { useState, useEffect } from "react";
import "./App.css";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import axios from "axios";

function App() {
  const path = "tabs";
  const [data, setData] = useState({ tabs: [], config: {backgroundColor: "#eee"} });
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    async function fetchData() {
      const configResponse = await axios.get(`${path}/config.json`);
      const config = configResponse.data;
      const tabs = config.tabs;
      const contentResponses = await axios.all(
        tabs.map(tab => axios.get(tab.src))
      );
      contentResponses.forEach((response, i) => {
        tabs[i].content = { __html: response.data };
      });
      setData(config);
      if (config.selected != null) {
        setSelected(config.selected);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="App">
      <Tabs selectedIndex={selected} onSelect={setSelected}>
        <TabList className="tabs" style={{backgroundColor: data.config.backgroundColor}}>
          {data.tabs.map((tab, i) => (
            <Tab
              key={i}
              className="tab"
              disabledClassName="tab-disabled"
              selectedClassName="tab-selected"
            >
              {tab.title}
            </Tab>
          ))}
        </TabList>
        {data.tabs.map((tab, i) => (
          <TabPanel key={i} className="tab-content" selectedClassName="tab-content-selected">
            <div dangerouslySetInnerHTML={tab.content} />
          </TabPanel>
        ))}
      </Tabs>
    </div>
  );
}

export default App;
