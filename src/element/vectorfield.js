/*
    Copyright 2008-2023
        Matthias Ehmann,
        Carsten Miller,
        Alfred Wassermann

    This file is part of JSXGraph.

    JSXGraph is free software dual licensed under the GNU LGPL or MIT License.

    You can redistribute it and/or modify it under the terms of the

      * GNU Lesser General Public License as published by
        the Free Software Foundation, either version 3 of the License, or
        (at your option) any later version
      OR
      * MIT License: https://github.com/jsxgraph/jsxgraph/blob/master/LICENSE.MIT

    JSXGraph is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public License and
    the MIT License along with JSXGraph. If not, see <https://www.gnu.org/licenses/>
    and <https://opensource.org/licenses/MIT/>.
 */

/*global JXG: true, define: true*/
/*jslint nomen: true, plusplus: true*/

/**
 * @fileoverview Example file for a triangle implemented as a extension to JSXGraph.
 */

import JXG from "../jxg";
import Type from "../utils/type";

/**
 * @class Vector field.
 * <p>
 * Plot a vector field either given by two functions f1(x, y) and f2(x,y) or by a function f(x, y) returning an array of size 2.
 *
 * @pseudo
 * @name Vectorfield
 * @augments JXG.Curve
 * @constructor
 * @type JXG.Curve
 * @throws {Error} If the element cannot be constructed with the given parent objects an exception is thrown.
 * Parameter options:
 * @param {Array|Function} F Either an array containing two functions f1(x, y) and f2(x, y) or function f(x, y) returning an array of length 2.
 * @param {Array} xData Array of length 3 containing start value for x, number of steps, end value of x. The vector field will contain
 * (number of steps) + 1 vectors in direction of x.
 * @param {Array} yData Array of length 3 containing start value for y, number of steps, end value of y. The vector field will contain
 * (number of steps) + 1 vectors in direction of y.
 *
 * @example
 * // Defining functions
 * var fx = (x, y) => Math.sin(y);
 * var fy = (x, y) => Math.cos(x);
 *
 * var field = board.create('vectorfield', [
 *         [fx, fy],    // Defining function
 *         [-6, 25, 6], // Horizontal mesh
 *         [-5, 20, 5], // Vertical mesh
 *     ]);
 *
 * </pre><div id="JXGa2040e30-48ea-47d4-9840-bd24cd49150b" class="jxgbox" style="width: 500px; height: 500px;"></div>
 * <script type="text/javascript">
 *     (function() {
 *         var board = JXG.JSXGraph.initBoard('JXGa2040e30-48ea-47d4-9840-bd24cd49150b',
 *             {boundingbox: [-8, 8, 8,-8], axis: true, showcopyright: false, shownavigation: false});
 *     // Defining functions
 *     var fx = (x, y) => Math.sin(y);
 *     var fy = (x, y) => Math.cos(x);
 *
 *     var field = board.create('vectorfield', [
 *             [fx, fy],    // Defining function
 *             [-6, 25, 6], // Horizontal mesh
 *             [-5, 20, 5], // Vertical mesh
 *         ]);
 *
 *     })();
 *
 * </script><pre>
 *
 * @example
 * // Slider to control length of vectors
 * var s = board.create('slider', [[-3, 7], [3, 7], [0, 0.33, 1]], {name: 'length'});
 * // Slider to control number of steps
 * var stepsize = board.create('slider', [[-3, 6], [3, 6], [1, 20, 100]], {name: 'steps', snapWidth: 1});
 *
 * // Defining functions
 * var fx = (x, y) => 0.2 * y;
 * var fy = (x, y) => 0.2 * (Math.cos(x) - 2) * Math.sin(x);
 *
 * var field = board.create('vectorfield', [
 *         [fx, fy],        // Defining function
 *         [-6, () => stepsize.Value(), 6], // Horizontal mesh
 *         [-5, () => stepsize.Value(), 5], // Vertical mesh
 *     ], {
 *         highlightStrokeColor: JXG.palette.blue, // Make highlighting invisible
 *
 *         scale: () => s.Value(), // Scaling of vectors
 *
 *         arrowHead: {
 *             enabled: true,
 *             size: 8,  // Pixel length of arrow head
 *             angle: Math.PI / 16
 *         }
 * });
 *
 * </pre><div id="JXG9196337e-66f0-4d09-8065-11d88c4ff140" class="jxgbox" style="width: 500px; height: 500px;"></div>
 * <script type="text/javascript">
 *     (function() {
 *         var board = JXG.JSXGraph.initBoard('JXG9196337e-66f0-4d09-8065-11d88c4ff140',
 *             {boundingbox: [-8, 8, 8,-8], axis: true, showcopyright: false, shownavigation: false});
 *     // Slider to control length of vectors
 *     var s = board.create('slider', [[-3, 7], [3, 7], [0, 0.33, 1]], {name: 'length'});
 *     // Slider to control number of steps
 *     var stepsize = board.create('slider', [[-3, 6], [3, 6], [1, 20, 100]], {name: 'steps', snapWidth: 1});
 *
 *     // Defining functions
 *     var fx = (x, y) => 0.2 * y;
 *     var fy = (x, y) => 0.2 * (Math.cos(x) - 2) * Math.sin(x);
 *
 *     var field = board.create('vectorfield', [
 *             [fx, fy],        // Defining function
 *             [-6, () => stepsize.Value(), 6], // Horizontal mesh
 *             [-5, () => stepsize.Value(), 5], // Vertical mesh
 *         ], {
 *             highlightStrokeColor: JXG.palette.blue, // Make highlighting invisible
 *
 *             scale: () => s.Value(), // Scaling of vectors
 *
 *             arrowHead: {
 *                 enabled: true,
 *                 size: 8,  // Pixel length of arrow head
 *                 angle: Math.PI / 16
 *             }
 *     });
 *
 *     })();
 *
 * </script><pre>
 *
 */
JXG.createVectorField = function(board, parents, attributes) {
    var el, attr;

    attr = Type.copyAttributes(attributes, board.options, 'vectorfield');
    el = board.create('curve', [[], []], attr);
    el.elType = 'vectorfield';

    /**
     * Set the defining functions of vector field.
     * @memberOf Vectorfield.prototype
     * @name setF
     * @function
     * @param {Array|Function} func Either an array containing two functions f1(x, y) and f2(x, y) or function f(x, y) returning an array of length 2.
     * @returns {Object} Reference to the vector field object.
     *
     * @example
     * field.setF([(x, y) => Math.sin(y), (x, y) => Math.cos(x)]);
     * board.update();
     *
     */
    el.setF = function(func) {
        if (Type.isArray(func)) {
            this.F = function(x, y) { return [func[0](x, y), func[1](x, y)]; };
        } else {
            this.F = func;
        }
        return this;
    };

    if (parents.length >= 3 &&
        (Type.isArray(parents[0]) || Type.isFunction(parents[0])) &&
        (Type.isArray(parents[1]) && parents[1].length === 3) &&
        (Type.isArray(parents[2]) && parents[2].length === 3)
    ) {
        el.setF(parents[0]);
        el.xData = parents[1];
        el.yData = parents[2];
    } else {
        throw new Error(
            "JSXGraph: Can't create vector field with parent types " +
                "'" + typeof parents[0] + "', " +
                "'" + typeof parents[1] + "', " +
                "'" + typeof parents[2] + "'."
        );
    }

    el.updateDataArray = function() {
        var x, y, i, j,
            scale = Type.evaluate(this.visProp.scale),
            start_x = Type.evaluate(this.xData[0]),
            steps_x = Type.evaluate(this.xData[1]),
            end_x = Type.evaluate(this.xData[2]),
            delta_x = (end_x - start_x) / steps_x,

            start_y = Type.evaluate(this.yData[0]),
            steps_y = Type.evaluate(this.yData[1]),
            end_y = Type.evaluate(this.yData[2]),
            delta_y = (end_y - start_y) / steps_y,
            dx, dy, d, theta, phi,

            showArrow = Type.evaluate(this.visProp.arrowhead.enabled),
            leg, leg_x, leg_y, alpha;


        if (showArrow) {
            // Arrow head style
            leg = Type.evaluate(this.visProp.arrowhead.size),
            leg_x = leg / board.unitX,
            leg_y = leg / board.unitY,
            alpha = Type.evaluate(this.visProp.arrowhead.angle);
        }

        this.dataX = [];
        this.dataY = [];

        for (i = 0, x = start_x; i <= steps_x; x += delta_x, i++) {
            for (j = 0, y = start_y; j <= steps_y; y += delta_y, j++) {
                d = this.F(x, y);
                dx = d[0] * scale;
                dy = d[1] * scale;

                this.dataX.push(x);
                this.dataY.push(y);
                this.dataX.push(x + dx);
                this.dataY.push(y + dy);

                if (showArrow && Math.abs(dx) + Math.abs(dy) > 0.0) {
                    // Arrow head
                    theta = Math.atan2(dy, dx);
                    phi = theta + alpha;
                    this.dataX.push(x + dx - Math.cos(phi) * leg_x);
                    this.dataY.push(y + dy - Math.sin(phi) * leg_y);
                    this.dataX.push(x + dx);
                    this.dataY.push(y + dy);
                    phi = theta - alpha;
                    this.dataX.push(x + dx - Math.cos(phi) * leg_x);
                    this.dataY.push(y + dy - Math.sin(phi) * leg_y);
                }

                this.dataX.push(NaN);
                this.dataY.push(NaN);
            }
        }
    };
    return el;
};

JXG.registerElement("vectorfield", JXG.createVectorField);
