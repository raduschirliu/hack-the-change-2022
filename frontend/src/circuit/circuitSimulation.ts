/* eslint-disable */

import { CircuitElement } from '../types';
import elementDefinitions from '../circuit/circuitElementDefinitions';

type Node = {
  id: string;
  type: string;
  state?: boolean; // state for input nodes
  // null if this is an input node,
  // otherwise a map of input names to nodes
  inputs: { [key: string]: Node | string | null } | null;
  // null if this is an input node,
  // otherwise a map of input names to the output name that this node is connected to
  outputIds: Record<string, string | null> | null;
  // { [inputValues]: { [outputIds]: value } }
  // where inputValues is a concatenated string of 1s and 0s in the order of the inputs
  truthTable: Record<string, Record<string, boolean>>;
};

type NodeSolution = {
  inputs?: { [key: string]: boolean }; // Key is input ID
  outputs?: { [key: string]: boolean }; // Key is output ID
};

export type Solution = {
  // Key is element ID
  [key: string]: NodeSolution;
};

export class CircuitSimulation {
  nodes: Record<string, Node> = {};
  outputNodes: Node[] = [];
  solution: Solution = {};

  constructor(elements: CircuitElement[]) {
    elements = JSON.parse(JSON.stringify(elements));

    // Create a map of element IDs to nodes
    const nodes: Record<string, Node> = {};
    for (const element of elements) {
      nodes[element.id] = {
        id: element.id,
        type: element.typeId,
        state: element.typeId === 'Input' ? element.params.state : undefined,
        inputs: Object.fromEntries(
          Object.entries(element.params.inputs).map(([inputName, inputEl]) => [
            inputName,
            inputEl !== null
              ? nodes[inputEl.elementId] || inputEl.elementId // If the node doesn't exist yet, use the element ID so we can resolve it later
              : null,
          ])
        ),
        outputIds: Object.fromEntries(
          Object.entries(element.params.inputs).map(([inputName, inputEl]) => [
            inputName,
            inputEl !== null ? inputEl.elementId : null,
          ])
        ),
        truthTable: elementDefinitions[element.typeId].truthTable,
      };
    }
    // Update the inputs of each node
    for (const [nodeId, node] of Object.entries(nodes)) {
      if (node.inputs) {
        for (const [inputName, inputNode] of Object.entries(node.inputs)) {
          if (typeof inputNode === 'string') {
            node.inputs[inputName] = nodes[inputNode];
          }
        }
        nodes[nodeId] = node;
      }
    }

    // Update the outputIds of each node
    for (const [nodeId, node] of Object.entries(nodes)) {
      if (node.outputIds) {
        for (const [inputName, elementId] of Object.entries(node.outputIds)) {
          if (elementId) {
            const element = elements.find((e) => e.id === elementId);
            if (element) {
              const outputName = Object.entries(element.params.outputs).find(
                ([, outputId]) => outputId?.elementId === nodeId
              )?.[0];
              if (outputName) {
                node.outputIds[inputName] = outputName;
              }
            }
          }
        }
        nodes[nodeId] = node;
      }
    }

    console.log(nodes);
    this.nodes = nodes;

    // Find output elements, then get corresponding nodes
    const outputElements = elements.filter((e) => e.typeId === 'Output');
    this.outputNodes = outputElements.map((e) => nodes[e.id]);
    console.log(this.outputNodes);
  }

  solve(): Solution {
    this.solution = {};

    for (const node of this.outputNodes) {
      if (!node.inputs) {
        console.error('Output node has no inputs');
        continue;
      }
      const nodeSolution: NodeSolution = {
        inputs: {},
        outputs: {},
      };
      for (const [inputName, inputNode] of Object.entries(node.inputs)) {
        if (typeof inputNode === 'string') {
          console.error('Input node is a string');
          continue;
        }
        if (!inputNode) {
          console.error('Input node is null');
          continue;
        }
        const outputValues = this.getNodeOutput(inputNode);
        if (!node.outputIds) {
          console.error('Node has no output IDs');
          continue;
        }
        const outputId = node.outputIds[inputName];
        if (!outputId) {
          console.error('Node has no output ID for input');
          continue;
        }

        if (!nodeSolution.inputs) {
          nodeSolution.inputs = {};
        }

        nodeSolution.inputs[inputName] = outputValues[outputId];
      }

      if (!nodeSolution.inputs) {
        nodeSolution.inputs = {};
      }

      // Get array of inputs, sorted by name
      const inputs = Object.keys(elementDefinitions[node.type].inputs).sort();
      // Get array of input values
      const inputValues = inputs.map((input) =>
        nodeSolution.inputs ? nodeSolution.inputs[input] ?? false : false
      );
      // Convert input values to a string of 1s and 0s
      const inputValuesString = inputValues
        .map((v) => (v ? '1' : '0'))
        .join('');

      nodeSolution.outputs = node.truthTable[inputValuesString];
      this.solution[node.id] = nodeSolution;
    }

    return this.solution;
  }

  getNodeOutput(node: Node): { [key: string]: boolean } {
    const nodeSolution: NodeSolution = {
      inputs: {},
      outputs: {},
    };

    // Check if this is an input node
    if (!node.inputs || Object.keys(node.inputs).length === 0) {
      nodeSolution.inputs = undefined;
      nodeSolution.outputs = { output_0: !!node.state };
      this.solution[node.id] = nodeSolution;
      return nodeSolution.outputs;
    }

    for (const [inputName, inputNode] of Object.entries(node.inputs)) {
      if (typeof inputNode === 'string') {
        console.error('Input node is a string');
        continue;
      }
      if (!inputNode) {
        console.error('Input node is null');
        continue;
      }
      const outputValues = this.getNodeOutput(inputNode);
      if (outputValues === undefined) {
        console.error('Output values is undefined', inputNode);
        continue;
      }

      if (!node.outputIds) {
        console.error('Node has no output IDs');
        continue;
      }
      const outputId = node.outputIds[inputName];
      if (!outputId) {
        console.error('Node has no output ID for input');
        continue;
      }

      if (!nodeSolution.inputs) {
        nodeSolution.inputs = {};
      }

      nodeSolution.inputs[inputName] = outputValues[outputId];
    }

    if (!nodeSolution.inputs) {
      nodeSolution.inputs = {};
    }

    // Get array of inputs, sorted by name
    const inputs = Object.keys(elementDefinitions[node.type].inputs).sort();
    // Get array of input values
    const inputValues = inputs.map((input) =>
      nodeSolution.inputs ? nodeSolution.inputs[input] ?? false : false
    );
    // Convert input values to a string of 1s and 0s
    const inputValuesString = inputValues.map((v) => (v ? '1' : '0')).join('');

    nodeSolution.outputs = node.truthTable[inputValuesString];
    this.solution[node.id] = nodeSolution;

    return nodeSolution.outputs;
  }
}
