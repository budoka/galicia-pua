import axios, { AxiosRequestConfig } from 'axios';
import { ObjectLiteral, QueryParams } from 'src/interfaces';
import { ThunkResult } from 'src/actions';
import { BoxTemplates, BoxTemplatesActionTypes, BoxTemplatesState } from './types';
import { API, apis } from 'src/services/api-data';
import { getAPIData } from 'src/utils/api';
import { BoxColumnTemplate, BoxDetailColumnTemplateAPIResponse, BoxTemplate, BoxTemplateAPIRequest } from './interfaces';
import { BoxFiltersState } from '../box-filters';
import { hashCode } from 'src/utils/string';
import { IRequestCache } from 'src/actions/interfaces';

/*
Example ...
const instance = axios.create({
  baseURL: 'https://some-domain.com/api/',
  timeout: 1000,
  headers: {'X-Custom-Header': 'foobar'}
})*/

const reqCache: IRequestCache<any> = { cache: {} };

export const getBoxTemplates = (data: BoxFiltersState['selected']): ThunkResult => async (dispatch, getState) => {
  const state = getState();
  const isRunning = state.boxes.filters.isRunning;

  if (isRunning) return;

  const apiName = API.CAJA;
  const idMethod = 'preview';
  const api = getAPIData(apiName, idMethod);

  const { url } = api;
  const { verb, path, headers } = api.method;

  const endpoint = `${url}/${path}`;

  const dataParsed: BoxTemplateAPIRequest = {
    idCaja: +data.boxType?.key!,
    tipoContenido: data.boxContentType?.value! as string,
    idPlantilla: +data.detailTemplate?.key!,
  };

  const config: AxiosRequestConfig = { method: verb, url: endpoint, headers, data: dataParsed };

  const index = hashCode(config);

  if (reqCache.cache[index]) {
    console.log('Cached preview!!!');
    const cachedData = reqCache.cache[index].data;
    dispatch(success(cachedData));
    return;
  }

  dispatch(running(true));

  return await axios(config)
    .then((response) => {
      let id = -1;
      const rawData: BoxDetailColumnTemplateAPIResponse[] = response.data;
      const columnsTemplate: BoxColumnTemplate[] = rawData.map((d) => {
        id = d.idPlantilla;
        return {
          id: d.id,
          title: d.titulo,
          dataType: d.tipo,
          required: d.opcional,
          order: d.orden,
          length: d.longitud,
        } as BoxColumnTemplate;
      });

      const template: BoxTemplate = { id, columnsTemplate };

      reqCache.cache[index] = { data: template };

      dispatch(success(template));
    })
    .catch((error) => {
      console.log('response error');
      dispatch(failure());
    });

  function running(fetch: BoxTemplatesState['isRunning']): BoxTemplatesActionTypes {
    return { type: BoxTemplates.RUNNING, payload: fetch };
  }

  function success(template: BoxTemplatesState['template']): BoxTemplatesActionTypes {
    return { type: BoxTemplates.GET_SUCCESS, payload: template };
  }

  function failure(): BoxTemplatesActionTypes {
    return { type: BoxTemplates.GET_FAILURE };
  }
};
