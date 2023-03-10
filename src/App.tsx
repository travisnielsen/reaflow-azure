import { Canvas, NodeProps, CanvasRef } from 'reaflow';
import prepareNode from './nodes'
import { nodeData, edgeData } from './data'
import './App.css';
import { useCallback, useRef, useState } from 'react';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

function App() {

  const nodes = nodeData();
  const edges = edgeData();

  // TODO: Look at this for canvas re-sizing: https://github.com/reaviz/reaflow/issues/111
  // TODO: Also see: https://github.com/reaviz/reaflow/issues/190
  const canvasRef = useRef<CanvasRef>(null);
  const [paneWidth, setPaneWidth] = useState(2000);
  const [paneHeight, setPaneHeight] = useState(2000)

  const calculatePaneWidthAndHeight = useCallback(() => {
      let newHeight = 0;
      let newWidth = 0;
      canvasRef?.current?.layout?.children?.forEach((node) => {
        if (node.y + node.height > newHeight) newHeight = node.y + node.height;
        if (node.x + node.width > newWidth) newWidth = node.x + node.width;
      });
      setPaneHeight(newHeight);
      setPaneWidth(newWidth);
  },[]);


  return (
    <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, background: 'black' }}>
      <TransformWrapper wheel={{ step: 0.2 }} minScale={0.5} maxScale={8} limitToBounds={false} >
        <TransformComponent>
          <div style={{ background: 'black' }}>
            <Canvas
              maxHeight={ 4000 }
              layoutOptions={{
                'elk.hierarchyHandling': 'INCLUDE_CHILDREN',        // required to enable edges from/to nested nodes
                'elk.nodeLabels.placement': 'INSIDE V_TOP H_RIGHT'
              }}
              direction='RIGHT'
              nodes={nodes}
              edges={edges}
              fit={true}
              node={(node: NodeProps) => prepareNode(node)}
              onLayoutChange={() => {
                calculatePaneWidthAndHeight()
              }}
            />
          </div>
        </TransformComponent>
      </TransformWrapper>
    </div>
  )
}

export default App;